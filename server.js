const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(express.json());
const mysql = require("mysql2");

const port = 8080;
let room = 0;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "webchatappdb",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

app.use(express.static("public")); // serve files from the public directory

const allowedRooms = new Set(["0", "1", "2"]);
app.get("/api/messages/:room", async (req, res) => {
  const roomId = req.params.room;
  console.log("roomId = req.params.room: " + roomId);
  if (!allowedRooms.has(roomId)) {
    return res.status(400).json({ error: "Invalid room" });
  }
  
  const table = `messages${roomId}`;
  const safeTable = connection.escapeId(table); //sql inject safety

  try {
    const [rows] = await connection
      .promise()
      .query(`SELECT * FROM ${safeTable} ORDER BY timestmp DESC LIMIT 2500;`);
    res.json(rows);
    console.log("Messages Loaded!");
  } catch (err) {
    console.error("DB error", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/messages/:room", async (req, res) => {
  const roomId = req.params.room;
  console.log("roomId = req.params.room: " + roomId);
  if (!allowedRooms.has(roomId)) {
    return res.status(400).json({ error: "Invalid room" });
  }

  const table = `messages${roomId}`;
  const safeTable = connection.escapeId(table); //sql inject safety
  //#region
  const { displayName, message } = req.body;
  const trimmedName = (displayName || "").trim();
  const sendMsg = (message || "").trim();
  const namePattern = /^[a-zA-Z0-9]{2,13}$/;
  const msgPattern = /^[a-zA-Z0-9 .,!?:;_-]{1,1500}$/;

  if (!sendMsg) {
    return res.status(400).json({ error: "Message required" });
  }
  if (!msgPattern.test(sendMsg)) {
    return res.status(400).json({ error: "Message denied" });
  }

  if (!trimmedName) {
    return res.status(400).json({ error: "Display name required" });
  }

  if (!namePattern.test(trimmedName)) {
    return res.status(400).json({ error: "Display name denied" });
  }
  if (sendMsg == "Type message here") {
    return res.status(400).json({ error: "don't type that" });
  }
  //#endregion
  try {
    const [result] = await connection
      .promise()
      .execute(`INSERT INTO ${table} (mesage, username) VALUES (?, ?)`, [
        sendMsg,
        trimmedName,
      ]);
    res.status(201).json({ id: result.insertId });
    console.log("Message send successful to " + table + "!");
  } catch (err) {
    console.error("Insert error", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  // server starts
  console.log(`Website running at http://localhost:${port}`);
});

app.use((req, res) => {
  //404 page
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});
