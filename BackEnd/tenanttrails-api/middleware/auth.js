import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const cookieToken = req.cookies?.token;

  // Fallback for Postman/Swagger manual testing.
  // Lab 6 frontend should use the httpOnly cookie.
  const header = req.headers.authorization;
  const bearerToken =
    header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}