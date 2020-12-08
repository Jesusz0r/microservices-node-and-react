import express, { Request, Response } from "express";

const router = express.Router();

router.delete("/", (req: Request, res: Response) => {
  res.send({});
});

export { router as newRoute };
