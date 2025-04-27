const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [username, email, hashedPassword]
    );

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ token });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token });
  } catch (err) {
    console.error("❌ Error logging in:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: `Hello ${req.userEmail}, you are authorized!` });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
