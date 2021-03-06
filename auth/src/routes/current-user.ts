import express from "express";

import { verifyUser } from "../middlewares";

const router = express.Router();

router.get("/current", verifyUser, (req, res) => {
  res.send({ user: req.user });
});

export { router as currentUserRoute };
