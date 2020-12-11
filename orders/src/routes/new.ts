import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import { Errors, Events, validateRequest } from "@encuentradepa/common";

import { Order, Ticket } from "../models";
import { verifyUser } from "../middlewares";

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { id: userId } = req.user!;
    const { ticketId } = req.body;
    const ticket = await Ticket.findOne({ _id: ticketId });

    if (!ticket) {
      throw new Errors.NotFoundError();
    }

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

    res.status(201).send({ order });
  }
);

export { router as newRoute };
