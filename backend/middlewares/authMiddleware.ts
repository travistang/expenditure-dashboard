import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import logger from "../../logger";
import { format } from "date-fns";

export const JWT_SECRET = process.env.JWT_SECRET || "0xdeadbeef";
const WHITELIST_PATH = [/^\/login$/, /^\/api\/login$/, /.*\.ico$/];

function reportUnauthorized(req: Request, res: Response) {
  logger.warn(
    `[Unauthorized] ${format(Date.now(), "pppp")} ${req.method} ${req.path} ${
      req.ip
    }`
  );
  if (req.path.startsWith("/api") || req.path === "/graphql") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const loginUrlWithRef = `/login?previous=${encodeURIComponent(req.path)}`;
  return res.redirect(loginUrlWithRef);
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.hostname !== "localhost") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.path.startsWith("/_next") && process.env.NODE_ENV !== "production") {
    return next();
  }

  const token = req.cookies?.["token"] ?? "";
  if (WHITELIST_PATH.some((regex) => regex.test(req.path))) {
    return next();
  }

  if (!token) {
    return reportUnauthorized(req, res);
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });
    return reportUnauthorized(req, res);
  }
}
