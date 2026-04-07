const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");


export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!username || !normalizedEmail || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const emailExists = await doesEmailDomainExist(normalizedEmail);
    if (!emailExists) {
      return res.status(400).json({ msg: "Email doesn't exist" });
    }

    // Check if user already exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [username, normalizedEmail, hashedPassword]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: result.insertId, username, email: normalizedEmail },

      process.env.JWT_SECRET,
      { expiresIn: AUTH_TOKEN_EXPIRES_IN }
    );

    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: { id: result.insertId, username, email: normalizedEmail },
    });
  } catch (err) {
    console.error("Register ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const validateRegistrationEmail = async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body?.email);

  if (!normalizedEmail) {
    return res.status(400).json({ msg: "Email is required", exists: false });
  }

  const exists = await doesEmailDomainExist(normalizedEmail);

  if (!exists) {
    return res.status(400).json({ msg: "Email doesn't exist", exists: false });
  }

  return res.json({ msg: "Email is valid", exists: true });
};

/* ---------------- LOGIN ---------------- */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [normalizedEmail]);

    if (rows.length === 0) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const user = rows[0];

    // Compare password
    const passwordHash = getUserPasswordHash(user);
    if (!passwordHash) {
      return res.status(500).json({ msg: "User password is not configured correctly" });
    }

    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const displayName = user.name ?? user.username ?? "User";

    const token = jwt.sign(
      { id: user.id, username: displayName, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: AUTH_TOKEN_EXPIRES_IN }
    );

    return res.json({
      msg: "Login successful",
      token,
      user: { id: user.id, username: displayName, email: user.email },
    });
  } catch (err) {
    console.error("Login ERROR:", err.message, err.stack);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};