import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Errors, Events } from "@encuentradepa/common";

import { verifyUser } from "../middlewares";
import { Order } from "../models";

const router = express.Router();

router.post(
  "/",
  verifyUser,
  [
    body("token").notEmpty().withMessage("token is required."),
    body("orderId").notEmpty().withMessage("orderId is required."),
  ],
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      throw new Errors.NotFoundError();
    }

    if (String(order.userId) !== String(req.user.id)) {
      throw new Errors.NotAuthorizedError("userId is invalid.");
    }

    if (order.status === Events.Status.OrderStatus.Cancelled) {
      throw new Errors.BadRequestError("Can not pay for a cancelled order.");
    }

    res.send({ order });
  }
);

export { router as newRoute };
