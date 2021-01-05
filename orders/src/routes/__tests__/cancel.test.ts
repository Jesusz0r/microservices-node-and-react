import request from "supertest";
import mongoose from "mongoose";
import { Events } from "@encuentradepa/common";

import { app } from "../../app";
import { Order, Ticket } from "../../models";
import { natsWrapper } from "../../nats-wrapper";

it("should return order with status 'cancelled' when succesful", async () => {
  const ticket = await Ticket.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vetusta Morla",
    price: 10,
  });
  const orderCreationResponse = await request(app)
    .post("/api/orders")
    .send({ ticketId: ticket._id })
    .expect(201);
  const cancelResponse = await request(app)
    .patch(`/api/orders/${orderCreationResponse.body.order._id}`)
    .expect(200);

  expect(cancelResponse.body).toHaveProperty("order");
  expect(cancelResponse.body.order).toHaveProperty("status");
  expect(cancelResponse.body.order.status).toBe(Events.Status.Order.Cancelled);
});

it("should return not found error if order does not exists", async () => {
  const ticket = await Ticket.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vetusta Morla",
    price: 10,
  });

  await request(app)
    .post("/api/orders")
    .send({ ticketId: ticket._id })
    .expect(201);
  await request(app)
    .patch(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .expect(404);
});

it("should return not authorized error if order does not belong to user", async () => {
  const ticket = await Ticket.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vetusta Morla",
    price: 10,
  });
  const order = await Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket,
    status: Events.Status.Order.AwaitingPayment,
    expiresAt: new Date(),
  });

  await request(app).patch(`/api/orders/${order._id}`).expect(401);
});

it("should send an event when an order is cancelled", async () => {
  const ticket = await Ticket.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vetusta Morla",
    price: 10,
  });
  const orderCreationResponse = await request(app)
    .post("/api/orders")
    .send({ ticketId: ticket._id })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${orderCreationResponse.body.order._id}`)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
