import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import { Errors } from "@encuentradepa/common";

import { verifyUser } from "../middlewares";
import { Order } from "../models";

const router = express.Router();

router.get(
  "/:id",
  verifyUser,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("tickedId is invalid."),
  ],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    const order = await Order.findOne({ _id: id }).populate("ticket");

    if (!order) {
      throw new Errors.NotFoundError();
    }

    if (String(order.userId) !== String(userId)) {
      throw new Errors.NotAuthorizedError(
        "User does not have that corresponding order."
      );
    }

    res.send({ order });
  }
);

export { router as showRoute };
