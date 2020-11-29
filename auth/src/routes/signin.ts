import express from "express";

const router = express.Router();

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  res.send("Hello, there!");
});

export { router as signinRoute };
