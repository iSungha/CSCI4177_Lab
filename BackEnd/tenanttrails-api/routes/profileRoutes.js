import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get logged-in user's profile and their reviews
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile returned
 *       401:
 *         description: Not logged in
 */
router.get("/", auth, async (req, res) => {
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

    const [reviews] = await pool.query(
      `
      SELECT
        r.id,
        r.apt_id AS aptId,
        r.user_id AS userId,
        r.rating,
        r.body,
        r.created AS date,
        r.image_url AS imageUrl,
        a.name AS apartmentName,
        a.address AS apartmentAddress,
        a.neighbourhood AS apartmentNeighbourhood
      FROM reviews r
      JOIN apartments a ON r.apt_id = a.id
      WHERE r.user_id = ?
      ORDER BY r.created DESC, r.id DESC
      `,
      [req.user.id]
    );

    res.json({
      user,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;