import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./swagger.js";
import { pool } from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import apartmentRoutes from "./routes/apartmentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.set("trust proxy", 1);

const clientOrigin = (
  process.env.CLIENT_ORIGIN || "http://localhost:5173"
).replace(/\/$/, "");

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

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
    console.error("DATABASE TEST ERROR:", error);

    res.status(500).json({
      status: "error",
      message: error?.message || "Database connection failed",
      code: error?.code || null,
      errno: error?.errno || null,
      sqlState: error?.sqlState || null,
      databaseConfig: {
        hostConfigured: Boolean(process.env.DB_HOST),
        portConfigured: Boolean(process.env.DB_PORT),
        userConfigured: Boolean(process.env.DB_USER),
        passwordConfigured: Boolean(process.env.DB_PASSWORD),
        databaseConfigured: Boolean(process.env.DB_NAME),
        databaseName: process.env.DB_NAME || null,
      },
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

export default app;