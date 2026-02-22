import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

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
      ORDER BY cs.session_id DESC`,
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
      `INSERT INTO chat_session (client_id, start_time, end_time, summary_generated)
       VALUES ($1, CURRENT_TIME, NULL, false)
       RETURNING session_id, client_id, start_time, end_time, summary_generated`,
      [clientId]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create session.", details: err.message });
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

    const { rows } = await pool.query(
      `INSERT INTO chat_message (session_id, sender_type, message_text, "timestamp")
       VALUES ($1, $2, $3, CURRENT_TIME)
       RETURNING message_id, session_id, sender_type, message_text, "timestamp"`,
      [sessionId, senderType, messageText.trim()]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Failed to save message.", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
