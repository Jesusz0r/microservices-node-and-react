import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Errors, Events } from "@encuentradepa/common";

import { OrderCancelled } from "../order-cancelled";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models";

const setup = async () => {
  // @ts-ignore
  const message: Message = {
    getSequence: () => 1,
    ack: jest.fn(),
  };
  const listener = new OrderCancelled(natsWrapper.client);
  const order = await Order.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    status: Events.Status.Order.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    version: 0,
  });
  const data: Events.Types.OrderCancelled["data"] = {
    id: order._id,
    version: order.version + 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  return { message, data, listener };
};

it("should succesfuly cancel the order and call the ack method", async () => {
  const { data, listener, message } = await setup();

  await listener.onMessage(data, message);

  const order = await Order.findOne({ _id: data.id });

  expect(order).toHaveProperty("status");
  expect(order!.status).toEqual(Events.Status.Order.Cancelled);
  expect(message.ack).toHaveBeenCalled();
});

it("should fail if orderId does not exists", async () => {
  try {
    const { data, listener, message } = await setup();

    await listener.onMessage(
      { ...data, id: new mongoose.Types.ObjectId().toHexString() },
      message
    );
  } catch (error) {
    expect(error).toBeInstanceOf(Errors.NotFoundError);
  }
});

it("should fail if order is already Completed or already Cancelled", async () => {
  try {
    const { data, listener, message } = await setup();
    const order = await Order.findOne({ _id: data.id });

    order!.set("status", Events.Status.Order.Completed);

    await order!.save();
    await listener.onMessage(
      {
        ...data,
        version: order!.version + 1,
      },
      message
    );
  } catch (error) {
    expect(error).toBeInstanceOf(Errors.BadRequestError);
  }
});
