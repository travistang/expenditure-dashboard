import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { JWT_SECRET } from "../../backend/middlewares/authMiddleware";
import { addHours } from "date-fns";

export default function loginHandler(req: Request, res: Response) {
  if (process.env.NODE_ENV !== "production") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(403).json({ error: "Unsupported method" });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing data" });
  }

  if (username !== process.env.USERNAME || password !== process.env.PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = jwt.sign({ ok: true }, JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    expires: addHours(Date.now(), 3),
  });
  return res.status(200).json({ ok: true });
}
