import express from "express";

const router = express.Router();

router.get("/current", (_, res) => {
  res.send("Hello, there!");
});

export { router as currentUserRoute };
