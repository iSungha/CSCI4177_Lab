import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Edit a review owned by the logged-in user
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 101
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, body]
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 4
 *               body:
 *                 type: string
 *                 example: Updated review text.
 *               imageUrl:
 *                 type: string
 *                 nullable: true
 *                 example: https://res.cloudinary.com/demo/image/upload/example.jpg
 *     responses:
 *       200:
 *         description: Review updated
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Logged in but not the review owner
 *       404:
 *         description: Review not found
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { rating, body, imageUrl } = req.body;

    const numericRating = Number(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

    if (!body || !body.trim()) {
      return res.status(400).json({
        error: "Review body is required",
      });
    }

    const [[review]] = await pool.query(
      "SELECT id, user_id FROM reviews WHERE id = ?",
      [req.params.id]
    );

    if (!review) {
      return res.status(404).json({
        error: "Review not found",
      });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({
        error: "Not your review",
      });
    }

    await pool.query(
      `
      UPDATE reviews
      SET rating = ?, body = ?, image_url = ?
      WHERE id = ?
      `,
      [numericRating, body.trim(), imageUrl || null, req.params.id]
    );

    const [[updatedReview]] = await pool.query(
      `
      SELECT
        r.id,
        r.apt_id AS aptId,
        r.user_id AS userId,
        r.rating,
        r.body,
        r.created AS date,
        r.image_url AS imageUrl,
        u.name AS author,
        u.initials AS authorInitials
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
      `,
      [req.params.id]
    );

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review owned by the logged-in user
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 101
 *     responses:
 *       200:
 *         description: Review deleted
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Logged in but not the review owner
 *       404:
 *         description: Review not found
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const [[review]] = await pool.query(
      "SELECT id, user_id FROM reviews WHERE id = ?",
      [req.params.id]
    );

    if (!review) {
      return res.status(404).json({
        error: "Review not found",
      });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({
        error: "Not your review",
      });
    }

    await pool.query("DELETE FROM comments WHERE review_id = ?", [
      req.params.id,
    ]);

    await pool.query("DELETE FROM reviews WHERE id = ?", [req.params.id]);

    res.json({
      ok: true,
      deletedReviewId: Number(req.params.id),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;