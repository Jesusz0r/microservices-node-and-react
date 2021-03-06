import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models";

beforeEach(() => {
  jest.clearAllMocks();
});

it("should not update a ticket if it does not exists", async () => {
  const id = new mongoose.Types.ObjectId();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "asdasd" })
    .expect(404);
});

it("should succesfuly update title of an existing ticket", async () => {
  const ticket = { title: "Vetusta morla", price: 40 };
  const newTitle = "asdasd";

  const createdTicket = await request(app)
    .post("/api/tickets")
    .send(ticket)
    .expect(201);

  const response = await request(app)
    .put(`/api/tickets/${createdTicket.body.ticket._id}`)
    .send({ title: newTitle })
    .expect(200);

  expect(response.body).toHaveProperty("ticket");
  expect(response.body.ticket).toHaveProperty("title");
  expect(response.body.ticket.title === ticket.title).toBe(false);
  expect(response.body.ticket.title).toBe(newTitle);
  expect(response.body.ticket).toHaveProperty("price");
  expect(response.body.ticket.price).toBe(ticket.price);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("should succesfuly update price of an existing ticket", async () => {
  const ticket = { title: "Vetusta morla", price: 40 };
  const newPrice = 20;

  const createdTicket = await request(app)
    .post("/api/tickets")
    .send(ticket)
    .expect(201);

  const response = await request(app)
    .put(`/api/tickets/${createdTicket.body.ticket._id}`)
    .send({ price: newPrice })
    .expect(200);

  expect(response.body).toHaveProperty("ticket");
  expect(response.body.ticket).toHaveProperty("title");
  expect(response.body.ticket.title).toBe(ticket.title);
  expect(response.body.ticket).toHaveProperty("price");
  expect(response.body.ticket.price === ticket.price).toBe(false);
  expect(response.body.ticket.price).toBe(newPrice);
});

it("should not allow updates when ticket has been reserved and has userId", async () => {
  const { body } = await request(app)
    .post("/api/tickets")
    .send({ title: "Vetusta morla", price: 40 })
    .expect(201);
  const ticket = await Ticket.findOne({ _id: body.ticket._id });

  ticket?.set("orderId", new mongoose.Types.ObjectId());

  await ticket?.save();
  await request(app)
    .put(`/api/tickets/${body.ticket._id}`)
    .send({ price: 20 })
    .expect(400);
});
