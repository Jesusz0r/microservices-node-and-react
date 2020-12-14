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

  const getTicketResponse = await request(app)
    .get(`/api/tickets/${response.body.ticket._id}`)
    .send()
    .expect(200);

  expect(getTicketResponse.body).toHaveProperty("ticket");
  expect(getTicketResponse.body.ticket).toHaveProperty("userId");
  expect(getTicketResponse.body.ticket).toHaveProperty("title");
  expect(getTicketResponse.body.ticket.title).toBe(ticket.title);
  expect(getTicketResponse.body.ticket).toHaveProperty("price");
  expect(getTicketResponse.body.ticket.price).toBe(ticket.price);
  expect(getTicketResponse.body.ticket).toHaveProperty("_id");
  expect(getTicketResponse.body.ticket._id).toBe(response.body.ticket._id);
});
