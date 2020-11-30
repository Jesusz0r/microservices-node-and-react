import express from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors";

const router = express.Router();

router.get("/current", (req, res) => {
  const { Authorization } = req.headers;
  const token = req.session?.jwt;

  if (!token && !Authorization) {
    throw new BadRequestError("User is invalid.");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    res.send({ user });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
});

export { router as currentUserRoute };
