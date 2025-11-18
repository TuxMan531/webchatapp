const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(express.json());
const mysql = require("mysql2");

const port = 8080;

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

app.get("/api/messages", async (req, res) => {
  try {
    const [rows] = await connection.promise().query("SELECT * FROM messages ORDER BY timestmp DESC LIMIT 2500;");
    res.json(rows);
    console.log("Messages Loaded!")
  } catch (err) {
    console.error("DB error", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/messages", async (req, res) => {
  const { displayName, message } = req.body;

  const trimmedName = (displayName || "").trim();
  const sendMsg = (message || "").trim();
  const namePattern = /^[a-zA-Z0-9]{2,7}$/;
  const msgPattern = /^[a-zA-Z0-9 ]{1,500}$/;

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
    try {
      const [result] = await connection
        .promise()
        .execute("INSERT INTO messages (mesage, username) VALUES (?, ?)", [
          sendMsg,
          trimmedName,
        ]);
      res.status(201).json({ id: result.insertId });
      console.log("Message send successful!");
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
