import request from "supertest";
import mongoose from "mongoose";
import { Events } from "@encuentradepa/common";

import { app } from "../../app";
import { Ticket, Order } from "../../models";

it("should return the right order related to that user", async () => {
  const ticket = await Ticket.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vetusta Morla",
    price: 10,
  });

  const orderCreationResponse = await request(app)
    .post("/api/orders")
    .send({ ticketId: ticket._id })
    .expect(201);
  const orderGetResponse = await request(app)
    .get(`/api/orders/${orderCreationResponse.body.order._id}`)
    .expect(200);

  expect(orderGetResponse.body).toHaveProperty("order");
  expect(orderGetResponse.body.order).toHaveProperty("status");
  expect(orderGetResponse.body.order.status).toBe(
    orderCreationResponse.body.order.status
  );
  expect(orderGetResponse.body.order).toHaveProperty("userId");
  expect(String(orderGetResponse.body.order.userId)).toBe(
    String(orderCreationResponse.body.order.userId)
  );
  expect(orderGetResponse.body.order).toHaveProperty("expiresAt");
  expect(orderGetResponse.body.order.expiresAt).toBe(
    orderCreationResponse.body.order.expiresAt
  );
  expect(orderGetResponse.body.order).toHaveProperty("ticket");
  expect(orderGetResponse.body.order.ticket.title).toBe(
    orderCreationResponse.body.order.ticket.title
  );
  expect(orderGetResponse.body.order.ticket.price).toBe(
    orderCreationResponse.body.order.ticket.price
  );
  expect(String(orderGetResponse.body.order.ticket._id)).toBe(
    String(orderCreationResponse.body.order.ticket._id)
  );
  expect(orderGetResponse.body.order).toHaveProperty("_id");
  expect(String(orderGetResponse.body.order._id)).toBe(
    String(orderCreationResponse.body.order._id)
  );
});

it("should return an 404 if user has no order assigned to it", async () => {
  const ticket = await Ticket.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vetusta morla",
    price: 10,
  });
  const order = await Order.build({
    ticket,
    expiresAt: new Date(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: Events.Status.OrderStatus.Created,
  });

  await request(app).get(`/api/orders/${order._id}`).send({}).expect(401);
});
