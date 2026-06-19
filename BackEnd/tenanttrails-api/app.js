import express from "express";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import { pool } from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import apartmentRoutes from "./routes/apartmentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check if the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TenantTrails API is running",
  });
});

/**
 * @swagger
 * /api/db-test:
 *   get:
 *     summary: Test MySQL database connection
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database connected successfully
 *       500:
 *         description: Database connection failed
 */
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS apartmentCount FROM apartments"
    );

    res.json({
      status: "ok",
      database: "connected",
      apartmentCount: rows[0].apartmentCount,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use("/api/upload", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;