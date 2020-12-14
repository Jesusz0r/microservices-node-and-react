import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Errors, Middlewares } from "@encuentradepa/common";

import { natsWrapper } from "../nats-wrapper";
import { verifyUser, checkTicketOwnership } from "../middlewares";
import { Ticket } from "../models";
import { Publishers } from "../events";

const router = express.Router();

router.put(
  "/:id",
  [
    body("title").optional().isLength({ min: 5 }).withMessage("Invalid title."),
    body("price").optional().isFloat({ gt: 0 }).withMessage("Invalid price."),
  ],
  verifyUser,
  checkTicketOwnership,
  Middlewares.validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const ticket = await Ticket.findOneAndUpdate(
      { _id: id },
      { title, price },
      { new: true, omitUndefined: true }
    );

    if (!ticket) {
      throw new Errors.NotFoundError();
    }

    const ticketUpdatedPublisher = new Publishers.TicketUpdated(
      natsWrapper.client
    );
    ticketUpdatedPublisher.publish({
      id: ticket._id,
      userId: String(ticket.userId),
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
    });

    res.send({ ticket });
  }
);

export { router as updateRoute };
