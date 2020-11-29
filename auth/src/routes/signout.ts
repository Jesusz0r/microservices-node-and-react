import express from "express";

const router = express.Router();

router.post("/signout", (_, res) => {
  res.send("Hello, there!");
});

export { router as signoutRoute };
