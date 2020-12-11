import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Middlewares, Errors, Events } from "@encuentradepa/common";

import { natsWrapper } from "../nats-wrapper";
import { Ticket } from "../models";
import { verifyUser } from "../middlewares";
import { Publishers } from "../events";

const router = express.Router();

router.post(
  "/",
  [
    body("title").trim().isLength({ min: 5 }).withMessage("Title is invalid."),
    body("price").trim().isFloat({ gt: 0 }).withMessage("Price is invalid."),
  ],
  Middlewares.validateRequest,
  verifyUser,
  async (req: Request, res: Response) => {
    try {
      const { id: userId } = req.user;
      const { title, price } = req.body;
      const ticket = await Ticket.create({
        userId,
        title,
        price,
      });

      const ticketCreatedPublisher = new Publishers.TicketCreated(
        natsWrapper.client
      );
      ticketCreatedPublisher.publish({
        id: ticket.id,
        userId: String(ticket.userId),
        title: ticket.title,
        price: ticket.price,
      });

      return res.status(201).send({ ticket });
    } catch (error) {
      throw new Errors.BadRequestError(error.message);
    }
  }
);

export { router as newRoute };
