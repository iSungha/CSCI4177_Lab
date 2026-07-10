import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const railwayDatabaseUrl = process.env.MYSQL_URL;

console.log("DATABASE CONFIG:", {
  usingRailwayUrl: Boolean(railwayDatabaseUrl),
  fallbackHostConfigured: Boolean(process.env.DB_HOST),
  fallbackDatabaseConfigured: Boolean(process.env.DB_NAME),
});

export const pool = railwayDatabaseUrl
  ? mysql.createPool(railwayDatabaseUrl)
  : mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });