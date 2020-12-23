import request from "supertest";
import mongoose from "mongoose";
import { Events } from "@encuentradepa/common";

import { app } from "../../app";
import { userId } from "../../middlewares/__mocks__/verify-user";
import { Order } from "../../models";

it("should return a 404 if order does not exists", async () => {
  await request(app)
    .post("/api/payments")
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: "asdasds",
    })
    .expect(404);
});

it("should return a 401 if userId does not belongs to the order", async () => {
  const order = await Order.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: Events.Status.OrderStatus.AwaitingPayment,
    version: 0,
  });

  await request(app)
    .post("/api/payments")
    .send({ orderId: order._id, token: "asdasd" })
    .expect(401);
});

it("should return 500 if order status is cancelled", async () => {
  const order = await Order.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId.toHexString(),
    price: 10,
    status: Events.Status.OrderStatus.Cancelled,
    version: 0,
  });

  await request(app)
    .post("/api/payments")
    .send({ orderId: order._id, token: "asdasd" })
    .expect(400);
});
