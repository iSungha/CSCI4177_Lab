import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a review image to Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully and Cloudinary URL returned
 *       400:
 *         description: No image file uploaded
 *       401:
 *         description: Missing or invalid token
 *       500:
 *         description: Server error or missing Cloudinary credentials
 */
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Image file is required",
      });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        error: "Cloudinary credentials are missing from .env",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tenanttrails",
        },
        (error, uploadedFile) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadedFile);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;