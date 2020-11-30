import express from "express";

const router = express.Router();

router.post("/signout", (req, res) => {
  req.session = { ...req.session, jwt: null };

  res.send({ user: null, token: null });
});

export { router as signoutRoute };
