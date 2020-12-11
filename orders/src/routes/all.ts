import express, { Request, Response } from "express";
import { Errors } from "@encuentradepa/common";

import { verifyUser } from "../middlewares";
import { Order } from "../models";

const router = express.Router();

router.get("/", verifyUser, async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const orders = await Order.find({ userId }).populate("ticket");

  res.send({ orders });
});

export { router as allRoute };
