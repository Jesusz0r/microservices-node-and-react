import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Events } from "@encuentradepa/common";

import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdated } from "../ticket-updated";
import { Ticket } from "../../../models";

const setup = async () => {
  const message: Message = {
    getSequence: (): number => 1,
    getSubject: (): string => "",
    getRawData: (): Buffer => Buffer.from("", "utf-8"),
    getCrc32: (): number => 1,
    getData: (): Buffer => Buffer.from("", "utf-8"),
    getTimestamp: (): Date => new Date(),
    getTimestampRaw: (): number => 1,
    isRedelivered: (): boolean => false,
    ack: jest.fn(),
  };
  const listener = new TicketUpdated(natsWrapper.client);
  const { _id: id, price, version } = await Ticket.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vetusta Morla",
    price: 10,
  });
  const data: Events.EventTypes.TicketUpdated["data"] = {
    id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "asdasd",
    price,
    version: version + 1,
  };

  return { message, data, listener };
};

it("should succesfuly update a ticket", async () => {
  const { data, listener, message } = await setup();
  await listener.onMessage(data, message);
  const ticket = await Ticket.findOne({ _id: data.id });

  expect(ticket).not.toBeNull();
  expect(String(ticket!._id)).toBe(String(data.id));
  expect(ticket!.title).toBe(data.title);
  expect(ticket!.price).toBe(data.price);
  expect(ticket!.version).toBe(data.version);
});

it("should call 'ack' method", async () => {
  const { data, listener, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
