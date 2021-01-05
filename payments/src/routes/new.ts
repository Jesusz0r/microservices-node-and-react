import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Errors, Events } from "@encuentradepa/common";

import { verifyUser } from "../middlewares";
import { stripe } from "../stripe";
import { Order, Payment } from "../models";
import { Publishers } from "../events";
import { natsWrapper } from "../nats-wrapper";

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

    if (order.status === Events.Status.Order.Cancelled) {
      throw new Errors.BadRequestError("Can not pay for a cancelled order.");
    }

    const { id: stripeId } = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = await Payment.create({ stripeId, orderId: order._id });
    const paymentCreatedPublisher = new Publishers.PaymentCreated(
      natsWrapper.client
    );

    await paymentCreatedPublisher.publish({
      orderId: order._id,
      paymentId: payment._id,
      stripeId,
    });

    res.status(201).send({ order, payment });
  }
);

export { router as newRoute };
