import "dotenv/config";
import express from "express";
import cors from "cors";
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
    const clientCheck = await pool.query("SELECT client_id FROM client WHERE client_id = $1", [clientId]);

    if (clientCheck.rowCount === 0) {
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

app.get("/api/clients/:clientId/profile", async (req, res) => {
  const clientId = Number.parseInt(req.params.clientId, 10);

  if (Number.isNaN(clientId)) {
    return res.status(400).json({ error: "Invalid client ID." });
  }

  try {
    const clientResult = await pool.query(
  `SELECT
     client_id,
     firstName AS "firstName",
     lastName AS "lastName",
     email
   FROM client
   WHERE client_id = $1`,
  [clientId]
  );

    if (clientResult.rowCount === 0) {
      return res.status(404).json({ error: "Client not found." });
    }

    const applicationsResult = await pool.query(
      `SELECT
        a.app_id,
        a.date_submitted,
        a.status,
        a.last_updated,
        ap.program_name,
        ap.description_plain_language
      FROM application a
      JOIN aid_program ap
        ON a.program_id = ap.program_id
      WHERE a.client_id = $1
      ORDER BY a.last_updated DESC NULLS LAST, a.app_id DESC`,
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
