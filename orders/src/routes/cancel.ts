import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import { Errors } from "@encuentradepa/common";

import { verifyUser } from "../middlewares";
import { Order } from "../models";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled";

const router = express.Router();

router.patch(
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
    const { id: userId } = req.user;
    const { id } = req.params;
    const order = await Order.findOne({ _id: id });

    if (!order) {
      throw new Errors.NotFoundError();
    }

    if (String(order.userId) !== String(userId)) {
      throw new Errors.NotAuthorizedError(
        "User does not have that corresponding order."
      );
    }

    const updatedOrder = await order.setCancelStatus();
    const cancelOrderPublisher = new OrderCancelledPublisher(
      natsWrapper.client
    );

    cancelOrderPublisher.publish({
      id: order._id,
      ticket: {
        id: order.ticket.id!,
      },
    });

    res.send({ order: updatedOrder });
  }
);

export { router as cancelRoute };
