import request from "supertest";

import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

beforeEach(() => {
  jest.clearAllMocks();
});

it('should have a "post" route listening on /api/tickets', async () => {
  await request(app).post("/api/tickets").send({}).expect(400);
});

it("should create a new ticket succesfuly", async () => {
  const ticket = { title: "Ticket para Vetusta Morla", price: 50 };
  const response = await request(app)
    .post("/api/tickets")
    .send(ticket)
    .expect(201);

  expect(response.body).toHaveProperty("ticket");
  expect(response.body.ticket).toHaveProperty("title");
  expect(response.body.ticket.title).toBe(ticket.title);
  expect(response.body.ticket).toHaveProperty("price");
  expect(response.body.ticket.price).toBe(ticket.price);
  expect(response.body.ticket).toHaveProperty("id");

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("should not create a new ticket if invalid title is provided", async () => {
  await request(app).post("/api/tickets").send({ price: 50 }).expect(400);
});

it("should not create a new ticket if price title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .send({ title: "Ticket", price: -10 })
    .expect(400);
});
