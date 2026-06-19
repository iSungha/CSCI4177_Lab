import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/apartments:
 *   get:
 *     summary: Get all apartments with rating and review count
 *     tags: [Apartments]
 *     responses:
 *       200:
 *         description: Apartment list returned
 */
router.get("/", async (req, res) => {
  try {
    const [apartments] = await pool.query(`
      SELECT
        a.id,
        a.name,
        a.address,
        a.neighbourhood,
        a.landlord,
        a.units,
        a.built,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating,
        COUNT(r.id) AS reviews
      FROM apartments a
      LEFT JOIN reviews r ON r.apt_id = a.id
      GROUP BY a.id, a.name, a.address, a.neighbourhood, a.landlord, a.units, a.built
      ORDER BY rating DESC
    `);

    res.json(apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/apartments/{id}:
 *   get:
 *     summary: Get one apartment with reviews and comments
 *     tags: [Apartments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Apartment detail returned
 *       404:
 *         description: Apartment not found
 */
router.get("/:id", async (req, res) => {
  try {
    const [[apartment]] = await pool.query(
      `
      SELECT
        a.id,
        a.name,
        a.address,
        a.neighbourhood,
        a.landlord,
        a.units,
        a.built,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating,
        COUNT(r.id) AS review_count
      FROM apartments a
      LEFT JOIN reviews r ON r.apt_id = a.id
      WHERE a.id = ?
      GROUP BY a.id, a.name, a.address, a.neighbourhood, a.landlord, a.units, a.built
      `,
      [req.params.id]
    );

    if (!apartment) {
      return res.status(404).json({ error: "Apartment not found" });
    }

    const [reviews] = await pool.query(
      `
      SELECT
        r.id,
        r.rating,
        r.body,
        r.created,
        r.image_url AS imageUrl,
        u.id AS userId,
        u.name AS author
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.apt_id = ?
      ORDER BY r.created DESC
      `,
      [req.params.id]
    );

    const [comments] = await pool.query(
      `
      SELECT
        c.id,
        c.review_id AS reviewId,
        c.body,
        c.created,
        u.id AS userId,
        u.name AS author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN reviews r ON c.review_id = r.id
      WHERE r.apt_id = ?
      ORDER BY c.created ASC
      `,
      [req.params.id]
    );

    const reviewsWithComments = reviews.map((review) => ({
      ...review,
      comments: comments.filter((comment) => comment.reviewId === review.id),
    }));

    res.json({
      ...apartment,
      reviews: reviewsWithComments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/apartments/{id}/reviews:
 *   post:
 *     summary: Add a review to an apartment
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
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
 *                 example: 5
 *               body:
 *                 type: string
 *                 example: API test review from Swagger.
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Review created
 *       401:
 *         description: No token
 */
router.post("/:id/reviews", auth, async (req, res) => {
  try {
    const { rating, body, imageUrl } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

    if (!body || !body.trim()) {
      return res.status(400).json({ error: "Review body is required" });
    }

    const [[apartment]] = await pool.query(
      "SELECT id FROM apartments WHERE id = ?",
      [req.params.id]
    );

    if (!apartment) {
      return res.status(404).json({ error: "Apartment not found" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO reviews (apt_id, user_id, rating, body, created, image_url)
      VALUES (?, ?, ?, ?, CURDATE(), ?)
      `,
      [req.params.id, req.user.id, rating, body.trim(), imageUrl || null]
    );

    res.status(201).json({
      id: result.insertId,
      apartmentId: Number(req.params.id),
      userId: req.user.id,
      rating,
      body: body.trim(),
      imageUrl: imageUrl || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/apartments/{apartmentId}/reviews/{reviewId}/comments:
 *   post:
 *     summary: Add a comment to a review
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: apartmentId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *       - in: path
 *         name: reviewId
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
 *             required: [body]
 *             properties:
 *               body:
 *                 type: string
 *                 example: API test comment from Swagger.
 *     responses:
 *       201:
 *         description: Comment created
 *       401:
 *         description: No token
 */
router.post("/:apartmentId/reviews/:reviewId/comments", auth, async (req, res) => {
  try {
    const { body } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({ error: "Comment body is required" });
    }

    const [[review]] = await pool.query(
      "SELECT id FROM reviews WHERE id = ? AND apt_id = ?",
      [req.params.reviewId, req.params.apartmentId]
    );

    if (!review) {
      return res.status(404).json({
        error: "Review not found for this apartment",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO comments (review_id, user_id, body, created)
      VALUES (?, ?, ?, CURDATE())
      `,
      [req.params.reviewId, req.user.id, body.trim()]
    );

    res.status(201).json({
      id: result.insertId,
      reviewId: Number(req.params.reviewId),
      userId: req.user.id,
      body: body.trim(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;