import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("should return 404 if ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0]).toHaveProperty("message");
  expect(response.body.errors[0].message).toBe("Not found.");
});

it("should return ticket if found", async () => {
  const ticket = { title: "Vetusta Morla", price: 50 };
  const response = await request(app)
    .post("/api/tickets")
    .send(ticket)
    .expect(201);

  const createdTicket = await request(app)
    .get(`/api/tickets/${response.body.ticket.id}`)
    .send()
    .expect(200);

  expect(createdTicket.body).toHaveProperty("ticket");
  expect(createdTicket.body.ticket).toHaveProperty("userId");
  expect(createdTicket.body.ticket).toHaveProperty("title");
  expect(createdTicket.body.ticket.title).toBe(ticket.title);
  expect(createdTicket.body.ticket).toHaveProperty("price");
  expect(createdTicket.body.ticket.price).toBe(ticket.price);
  expect(createdTicket.body.ticket).toHaveProperty("id");
  expect(createdTicket.body.ticket.id).toBe(response.body.ticket.id);
});
