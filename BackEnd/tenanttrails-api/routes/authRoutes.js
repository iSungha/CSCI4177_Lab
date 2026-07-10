import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const WEEK = 7 * 24 * 60 * 60 * 1000;

function signToken(id) {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function cookieOptions() {
  const production = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: production ? "none" : "lax",
    secure: production,
    maxAge: WEEK,
  };
}

function clearCookieOptions() {
  const production = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: production ? "none" : "lax",
    secure: production,
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
 *                 example: Demo User
 *               email:
 *                 type: string
 *                 example: demo@dal.ca
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid request
 *       409:
 *         description: Email already exists
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const cleanName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const [[existingUser]] = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
      `,
      [normalizedEmail]
    );

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const initials = cleanName
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);

    const [result] = await pool.query(
      `
      INSERT INTO users (name, email, password, initials)
      VALUES (?, ?, ?, ?)
      `,
      [cleanName, normalizedEmail, hashedPassword, initials]
    );

    const user = {
      id: result.insertId,
      name: cleanName,
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
 *     summary: Log in
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
 *                 example: demo@dal.ca
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [[storedUser]] = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        initials
      FROM users
      WHERE email = ?
      `,
      [normalizedEmail]
    );

    if (!storedUser) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    let passwordMatches = false;

    try {
      passwordMatches = await bcrypt.compare(
        password,
        storedUser.password
      );
    } catch {
      passwordMatches = false;
    }

    // Supports old Lab 4/5 plaintext rows and migrates them to bcrypt.
    if (!passwordMatches && storedUser.password === password) {
      passwordMatches = true;

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `
        UPDATE users
        SET password = ?
        WHERE id = ?
        `,
        [hashedPassword, storedUser.id]
      );
    }

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = {
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      initials: storedUser.initials,
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
 *     summary: Get the current logged-in user
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
      `
      SELECT
        id,
        name,
        email,
        initials
      FROM users
      WHERE id = ?
      `,
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
 *     summary: Log out
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token", clearCookieOptions());

  res.json({
    ok: true,
  });
});

export default router;