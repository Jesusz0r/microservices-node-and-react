import request from "supertest";
import mongoose from "mongoose";
import { Events } from "@encuentradepa/common";

import { app } from "../../app";
import { Ticket, Order } from "../../models";

const buildTicket = async () =>
  Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vetusta morla",
    price: 10,
  });

it("should return the right amount of orders related to that user", async () => {
  //Create all the tickets previously
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // Create a new order with a different userId to simulate another user has reserved this order.
  await Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: Events.Status.OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticketOne,
  });

  // Make to requests to create new orders with the right userId.
  const orderOneResponse = await request(app)
    .post("/api/orders")
    .send({ ticketId: ticketTwo._id })
    .expect(201);
  const orderTwoResponse = await request(app)
    .post("/api/orders")
    .send({ ticketId: ticketThree._id })
    .expect(201);

  // Get all orders from current user (user checked by the middleware and stored in req.user)
  const responseAllOrders = await request(app)
    .get("/api/orders")
    .send({})
    .expect(200);

  expect(responseAllOrders.body).toHaveProperty("orders");
  expect(responseAllOrders.body.orders).toHaveLength(2);
  expect(String(responseAllOrders.body.orders[0].id)).toBe(
    String(orderOneResponse.body.order.id)
  );
  expect(responseAllOrders.body.orders[0].title).toBe(
    orderOneResponse.body.order.title
  );
  expect(responseAllOrders.body.orders[0].price).toBe(
    orderOneResponse.body.order.price
  );
  expect(String(responseAllOrders.body.orders[1].id)).toBe(
    String(orderTwoResponse.body.order.id)
  );
  expect(responseAllOrders.body.orders[1].title).toBe(
    orderTwoResponse.body.order.title
  );
  expect(responseAllOrders.body.orders[1].price).toBe(
    orderTwoResponse.body.order.price
  );
});
