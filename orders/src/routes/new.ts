import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import { Errors, Events, Middlewares } from "@encuentradepa/common";

import { Order, Ticket } from "../models";
import { verifyUser } from "../middlewares";
import { natsWrapper } from "../nats-wrapper";
import { Publishers } from "../events";

const EXPIRATION_WINDOW_SECONDS =
  process.env.EXPIRATION_WINDOW_SECONDS || 15 * 60;
const router = express.Router();

router.post(
  "/",
  verifyUser,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("tickedId is invalid."),
  ],
  Middlewares.validateRequest,
  async (req: Request, res: Response) => {
    const { id: userId } = req.user!;
    const { ticketId } = req.body;
    const ticket = await Ticket.findOne({ _id: ticketId });

    if (!ticket) {
      throw new Errors.NotFoundError();
    }

    console.log("ticket:", ticket);

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new Errors.BadRequestError("Ticket is already reserved.");
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + Number(EXPIRATION_WINDOW_SECONDS)
    );

    const order = await Order.build({
      userId,
      status: Events.Status.OrderStatus.Created,
      expiresAt,
      ticket,
    });

    const orderCreatedPublisher = new Publishers.OrderCreated(
      natsWrapper.client
    );

    orderCreatedPublisher.publish({
      id: order._id,
      userId,
      version: ticket.version,
      status: Events.Status.OrderStatus.Created,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket._id,
        price: 10,
      },
    });
    res.status(201).send({ order });
  }
);

export { router as newRoute };
