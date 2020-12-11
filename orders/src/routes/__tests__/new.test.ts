import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Order, Ticket } from "../../models";
import { Events } from "@encuentradepa/common";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket we are using to create an order does not exists", async () => {
  const unexistingTicketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .send({ ticketId: unexistingTicketId })
    .expect(404);
});

it("returns an error if the ticket we are using to create an order is reserved", async () => {
  const ticket = await Ticket.build({
    title: "Vetusta Morla",
    price: 10,
  });

  await Order.build({
    ticket,
    expiresAt: new Date(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: Events.Status.OrderStatus.Created,
  });
  await request(app)
    .post("/api/orders")
    .send({ ticketId: ticket._id })
    .expect(400);
});

it("succesfuly reserves a ticket", async () => {
  const ticket = await Ticket.build({
    title: "Vetusta Morla",
    price: 10,
  });

  const response = await request(app)
    .post("/api/orders")
    .send({ ticketId: ticket._id })
    .expect(201);

  expect(response.body).toHaveProperty("order");
  expect(response.body.order).toHaveProperty("status");
  expect(response.body.order.status).toBe(Events.Status.OrderStatus.Created);
  expect(response.body.order).toHaveProperty("userId");
  expect(response.body.order).toHaveProperty("expiresAt");
  expect(response.body.order).toHaveProperty("ticket");
  expect(response.body.order.ticket).toHaveProperty("title");
  expect(response.body.order.ticket.title).toBe(ticket.title);
  expect(response.body.order.ticket).toHaveProperty("price");
  expect(response.body.order.ticket.price).toBe(ticket.price);
  expect(response.body.order.ticket).toHaveProperty("id");
  expect(response.body.order.ticket.id).toBe(String(ticket._id));
});

it("should send an event when an order is created", async () => {
  const ticket = await Ticket.build({
    title: "Vetusta Morla",
    price: 10,
  });

  await request(app)
    .post("/api/orders")
    .send({ ticketId: ticket._id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
