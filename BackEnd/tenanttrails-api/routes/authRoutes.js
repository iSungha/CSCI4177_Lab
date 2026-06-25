import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test User
 *               email:
 *                 type: string
 *                 example: testuser@dal.ca
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created and auth cookie set
 *       400:
 *         description: Invalid input
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        error: "Enter a valid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const [[existingUser]] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUser) {
      return res.status(400).json({
        error: "Email is already registered",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const initials = name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, initials) VALUES (?, ?, ?, ?)",
      [name, normalizedEmail, hash, initials]
    );

    const user = {
      id: result.insertId,
      name,
      email: normalizedEmail,
      initials,
    };

    const token = signToken(user.id);

    res.cookie("token", token, cookieOptions());

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and set an httpOnly auth cookie
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: testuser@dal.ca
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful and cookie set
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const [[userRow]] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (!userRow) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    let passwordMatches = false;

    if (userRow.password.startsWith("$2")) {
      passwordMatches = await bcrypt.compare(password, userRow.password);
    } else {
      // Helps if old Lab 4 seed users still have plain text passwords.
      passwordMatches = password === userRow.password;

      if (passwordMatches) {
        const hash = await bcrypt.hash(password, 10);
        await pool.query("UPDATE users SET password = ? WHERE id = ?", [
          hash,
          userRow.id,
        ]);
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      initials: userRow.initials,
    };

    const token = signToken(user.id);

    res.cookie("token", token, cookieOptions());

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the currently logged-in user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user returned
 *       401:
 *         description: Not logged in
 */
router.get("/me", auth, async (req, res) => {
  try {
    const [[user]] = await pool.query(
      "SELECT id, name, email, initials FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout and clear the auth cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.json({
    ok: true,
    message: "Logged out",
  });
});

export default router;