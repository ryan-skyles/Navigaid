import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:
    "You are HousingAid, a helpful assistant for finding government aid programs, " +
    "especially housing assistance. Provide clear, empathetic, and actionable guidance " +
    "about eligibility requirements, application processes, and available resources. " +
    "Keep responses concise but thorough. If you are unsure about specific details, " +
    "recommend the user contact their local housing authority or 211 helpline.",
});

app.use(cors());
app.use(express.json());

const PASSWORD_KEYLEN = 64;
const PASSWORD_DIGEST = "sha512";
const PASSWORD_ITERATIONS = 120000;

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEYLEN, PASSWORD_DIGEST)
    .toString("hex");

  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, expectedHash] = String(storedHash ?? "").split(":");

  if (!String(storedHash ?? "").includes(":")) {
    return password === String(storedHash ?? "");
  }

  if (!salt || !expectedHash) {
    return false;
  }

  const actualHash = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEYLEN, PASSWORD_DIGEST)
    .toString("hex");

  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const actualBuffer = Buffer.from(actualHash, "hex");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

app.get("/", (req, res) => {
  res.json({ message: "Gov Aid Assistance API", status: "ok" });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "healthy", database: "connected" });
  } catch (err) {
    res.status(503).json({ status: "unhealthy", database: "disconnected", error: err.message });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  const { firstName = "", lastName = "", email, password } = req.body ?? {};
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const normalizedPassword = String(password ?? "");

  if (!normalizedEmail || !normalizedPassword) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (normalizedPassword.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const first = String(firstName).trim();
  const last = String(lastName).trim();
  if (!first || !last) {
    return res.status(400).json({ error: "First and last name are required." });
  }

  const existingUser = await pool.query("SELECT user_id FROM users WHERE email = $1", [normalizedEmail]);
  if (existingUser.rowCount > 0) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = hashPassword(normalizedPassword);
  const dbClient = await pool.connect();
  try {
    await dbClient.query("BEGIN");
    const { rows } = await dbClient.query(
      `INSERT INTO users (first_name, last_name, email)
       VALUES ($1, $2, $3)
       RETURNING user_id, first_name, last_name, email`,
      [first, last, normalizedEmail]
    );
    const userId = rows[0].user_id;
    await dbClient.query(
      `INSERT INTO login (user_id, username, password_hash, is_active)
       VALUES ($1, $2, $3, TRUE)`,
      [userId, normalizedEmail, passwordHash]
    );
    await dbClient.query("COMMIT");

    return res.status(201).json({
      ok: true,
      user: {
        clientId: userId,
        firstName: rows[0].first_name,
        lastName: rows[0].last_name,
        email: rows[0].email,
      },
    });
  } catch (err) {
    await dbClient.query("ROLLBACK").catch(() => {});
    if (err.code === "23505") {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    return res.status(500).json({ error: "Failed to create account.", details: err.message });
  } finally {
    dbClient.release();
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const normalizedPassword = String(password ?? "");

  if (!normalizedEmail || !normalizedPassword) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { rows } = await pool.query(
      `SELECT u.user_id, u.first_name, u.last_name, u.email, l.password_hash
       FROM users u
       INNER JOIN login l ON l.user_id = u.user_id
       WHERE u.email = $1 AND l.is_active = TRUE`,
      [normalizedEmail]
    );

    if (rows.length === 0 || !verifyPassword(normalizedPassword, rows[0].password_hash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const userId = rows[0].user_id;
    await pool.query(`UPDATE login SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = $1`, [userId]);

    return res.json({
      ok: true,
      user: {
        clientId: userId,
        firstName: rows[0].first_name,
        lastName: rows[0].last_name,
        email: rows[0].email,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to log in.", details: err.message });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const clientId = Number.parseInt(req.query.clientId, 10);

  if (Number.isNaN(clientId)) {
    return res.status(400).json({ error: "Invalid client ID." });
  }

  try {
    const { rows } = await pool.query(
      "SELECT user_id, first_name, last_name, email FROM users WHERE user_id = $1",
      [clientId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({
      ok: true,
      user: {
        clientId: rows[0].user_id,
        firstName: rows[0].first_name,
        lastName: rows[0].last_name,
        email: rows[0].email,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load user.", details: err.message });
  }
});

app.get("/api/clients/:clientId/sessions", async (req, res) => {
  const clientId = Number.parseInt(req.params.clientId, 10);

  if (Number.isNaN(clientId)) {
    return res.status(400).json({ error: "Invalid client ID." });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
        cs.session_id,
        cs.client_id,
        cs.start_time,
        cs.end_time,
        cs.summary_generated,
        cs.is_starred,
        lm.message_text AS last_message_text,
        lm.sender_type AS last_message_sender,
        COALESCE(mc.message_count, 0) AS message_count
      FROM chat_session cs
      LEFT JOIN LATERAL (
        SELECT cm.message_text, cm.sender_type
        FROM chat_message cm
        WHERE cm.session_id = cs.session_id
        ORDER BY cm.message_id DESC
        LIMIT 1
      ) lm ON true
      LEFT JOIN (
        SELECT session_id, COUNT(*)::INT AS message_count
        FROM chat_message
        GROUP BY session_id
      ) mc ON mc.session_id = cs.session_id
      WHERE cs.client_id = $1
      ORDER BY cs.is_starred DESC, cs.session_id DESC`,
      [clientId]
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch sessions.", details: err.message });
  }
});

app.post("/api/clients/:clientId/sessions", async (req, res) => {
  const clientId = Number.parseInt(req.params.clientId, 10);

  if (Number.isNaN(clientId)) {
    return res.status(400).json({ error: "Invalid client ID." });
  }

  try {
    const userCheck = await pool.query("SELECT user_id FROM users WHERE user_id = $1", [clientId]);

    if (userCheck.rowCount === 0) {
      return res.status(404).json({ error: "Client not found." });
    }

    const { rows } = await pool.query(
      `INSERT INTO chat_session (client_id, start_time, end_time, summary_generated, is_starred)
       VALUES ($1, CURRENT_TIME, NULL, false, false)
       RETURNING session_id, client_id, start_time, end_time, summary_generated, is_starred`,
      [clientId]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create session.", details: err.message });
  }
});

app.patch("/api/clients/:clientId/sessions/:sessionId", async (req, res) => {
  const clientId = Number.parseInt(req.params.clientId, 10);
  const sessionId = Number.parseInt(req.params.sessionId, 10);
  const { isStarred } = req.body;

  if (Number.isNaN(clientId)) {
    return res.status(400).json({ error: "Invalid client ID." });
  }

  if (Number.isNaN(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID." });
  }

  if (typeof isStarred !== "boolean") {
    return res.status(400).json({ error: "isStarred must be a boolean." });
  }

  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE chat_session
       SET is_starred = $1
       WHERE session_id = $2 AND client_id = $3
       RETURNING session_id, client_id, start_time, end_time, summary_generated, is_starred`,
      [isStarred, sessionId, clientId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update session.", details: err.message });
  }
});

app.delete("/api/clients/:clientId/sessions/:sessionId", async (req, res) => {
  const clientId = Number.parseInt(req.params.clientId, 10);
  const sessionId = Number.parseInt(req.params.sessionId, 10);

  if (Number.isNaN(clientId)) {
    return res.status(400).json({ error: "Invalid client ID." });
  }

  if (Number.isNaN(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID." });
  }

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM chat_session WHERE session_id = $1 AND client_id = $2",
      [sessionId, clientId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete session.", details: err.message });
  }
});

app.get("/api/sessions/:sessionId/messages", async (req, res) => {
  const sessionId = Number.parseInt(req.params.sessionId, 10);

  if (Number.isNaN(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID." });
  }

  try {
    const sessionCheck = await pool.query(
      "SELECT session_id FROM chat_session WHERE session_id = $1",
      [sessionId]
    );

    if (sessionCheck.rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    const { rows } = await pool.query(
      `SELECT
        message_id,
        session_id,
        sender_type,
        message_text,
        "timestamp"
      FROM chat_message
      WHERE session_id = $1
      ORDER BY message_id ASC`,
      [sessionId]
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch messages.", details: err.message });
  }
});

app.post("/api/sessions/:sessionId/messages", async (req, res) => {
  const sessionId = Number.parseInt(req.params.sessionId, 10);
  const { messageText, senderType = "user" } = req.body;

  if (Number.isNaN(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID." });
  }

  if (!messageText || typeof messageText !== "string" || messageText.trim().length === 0) {
    return res.status(400).json({ error: "messageText is required." });
  }

  if (!["user", "assistant"].includes(senderType)) {
    return res.status(400).json({ error: "senderType must be 'user' or 'assistant'." });
  }

  try {
    const sessionCheck = await pool.query(
      "SELECT session_id FROM chat_session WHERE session_id = $1",
      [sessionId]
    );

    if (sessionCheck.rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    const { rows: userRows } = await pool.query(
      `INSERT INTO chat_message (session_id, sender_type, message_text, "timestamp")
       VALUES ($1, $2, $3, CURRENT_TIME)
       RETURNING message_id, session_id, sender_type, message_text, "timestamp"`,
      [sessionId, senderType, messageText.trim()]
    );
    const savedUserMessage = userRows[0];

    if (senderType !== "user") {
      return res.status(201).json({ userMessage: savedUserMessage, assistantMessage: null });
    }

    const { rows: historyRows } = await pool.query(
      `SELECT sender_type, message_text FROM chat_message
       WHERE session_id = $1 ORDER BY message_id ASC`,
      [sessionId]
    );

    const chatHistory = historyRows.slice(0, -1).map((row) => ({
      role: row.sender_type === "user" ? "user" : "model",
      parts: [{ text: row.message_text }],
    }));

    const chat = geminiModel.startChat({ history: chatHistory });
    const result = await chat.sendMessage(messageText.trim());
    const assistantText = result.response.text();

    const { rows: assistantRows } = await pool.query(
      `INSERT INTO chat_message (session_id, sender_type, message_text, "timestamp")
       VALUES ($1, 'assistant', $2, CURRENT_TIME)
       RETURNING message_id, session_id, sender_type, message_text, "timestamp"`,
      [sessionId, assistantText]
    );

    return res.status(201).json({
      userMessage: savedUserMessage,
      assistantMessage: assistantRows[0],
    });
  } catch (err) {
    console.error("Message route error:", err);
    return res.status(500).json({ error: "Failed to save message.", details: err.message });
  }
});

// Guest AI chat — no DB writes, just returns AI response
app.post("/api/chat/guest", async (req, res) => {
  const { messageText, conversationHistory = [] } = req.body;

  if (!messageText || typeof messageText !== "string" || messageText.trim().length === 0) {
    return res.status(400).json({ error: "messageText is required." });
  }

  try {
    const chatHistory = conversationHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = geminiModel.startChat({ history: chatHistory });
    const result = await chat.sendMessage(messageText.trim());
    const assistantText = result.response.text();

    return res.json({ assistantMessage: assistantText });
  } catch (err) {
    console.error("Guest chat error:", err);
    return res.status(500).json({ error: "Failed to get AI response." });
  }
});

// Batch import messages into a session (used for guest→account migration)
app.post("/api/sessions/:sessionId/import", async (req, res) => {
  const sessionId = Number.parseInt(req.params.sessionId, 10);
  const { messages } = req.body;

  if (Number.isNaN(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID." });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required." });
  }

  try {
    const sessionCheck = await pool.query(
      "SELECT session_id FROM chat_session WHERE session_id = $1",
      [sessionId]
    );

    if (sessionCheck.rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    for (const msg of messages) {
      if (!msg.sender_type || !msg.message_text) continue;
      await pool.query(
        `INSERT INTO chat_message (session_id, sender_type, message_text, "timestamp")
         VALUES ($1, $2, $3, CURRENT_TIME)`,
        [sessionId, msg.sender_type, String(msg.message_text)]
      );
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Import error:", err);
    return res.status(500).json({ error: "Failed to import messages." });
  }
});

app.get("/api/clients/:clientId/profile", async (req, res) => {
  const clientId = Number.parseInt(req.params.clientId, 10);

  if (Number.isNaN(clientId)) {
    return res.status(400).json({ error: "Invalid client ID." });
  }

  try {
    const clientResult = await pool.query(
      `SELECT
         user_id AS client_id,
         first_name AS "firstName",
         last_name AS "lastName",
         email,
         household_size AS "householdSize",
         income,
         employment_status AS "employmentStatus",
         housing_status AS "housingStatus",
         disability_status AS "disabilityStatus",
         veteran_status AS "veteranStatus"
       FROM users
       WHERE user_id = $1`,
      [clientId]
    );

    if (clientResult.rowCount === 0) {
      return res.status(404).json({ error: "Client not found." });
    }

    const applicationsResult = await pool.query(
      `SELECT
        ua.user_application_id AS app_id,
        ua.date_started AS date_submitted,
        ua.status,
        ua.last_updated,
        a.application_name AS program_name,
        a.description AS description_plain_language
      FROM user_applications ua
      JOIN applications a ON a.application_id = ua.application_id
      WHERE ua.user_id = $1
      ORDER BY ua.last_updated DESC NULLS LAST, ua.user_application_id DESC`,
      [clientId]
    );

    return res.json({
      client: clientResult.rows[0],
      applications: applicationsResult.rows,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch profile.",
      details: err.message,
    });
  }
});

app.post("/api/profile", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    city,
    state,
    zip_code,
    date_of_birth,
    household_size,
    income,
    employment_status,
    housing_status,
    disability_status,
    veteran_status,
    preferred_language,
  } = req.body ?? {};

  const normalizedEmail = String(email ?? "").trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ error: "Email is required." });
  }
  if (!first_name || !last_name) {
    return res.status(400).json({ error: "First and last name are required." });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO users (
        first_name, last_name, email, phone, city, state, zip_code,
        date_of_birth, household_size, income, employment_status,
        housing_status, disability_status, veteran_status, preferred_language
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (email) DO UPDATE SET
        first_name         = EXCLUDED.first_name,
        last_name          = EXCLUDED.last_name,
        phone              = EXCLUDED.phone,
        city               = EXCLUDED.city,
        state              = EXCLUDED.state,
        zip_code           = EXCLUDED.zip_code,
        date_of_birth      = EXCLUDED.date_of_birth,
        household_size     = EXCLUDED.household_size,
        income             = EXCLUDED.income,
        employment_status  = EXCLUDED.employment_status,
        housing_status     = EXCLUDED.housing_status,
        disability_status  = EXCLUDED.disability_status,
        veteran_status     = EXCLUDED.veteran_status,
        preferred_language = EXCLUDED.preferred_language,
        updated_at         = CURRENT_TIMESTAMP
      RETURNING user_id, first_name, last_name, email`,
      [
        String(first_name).trim(),
        String(last_name).trim(),
        normalizedEmail,
        phone || null,
        city || null,
        state || null,
        zip_code || null,
        date_of_birth || null,
        household_size ? Number(household_size) : null,
        income ? Number(income) : null,
        employment_status || null,
        housing_status || null,
        disability_status || null,
        veteran_status || null,
        preferred_language || "English",
      ]
    );

    return res.status(201).json({ ok: true, user: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: "Failed to save profile.", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
