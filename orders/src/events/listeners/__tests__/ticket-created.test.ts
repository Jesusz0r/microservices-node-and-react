import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Events } from "@encuentradepa/common";

import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreated } from "../ticket-created";
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
  const listener = new TicketCreated(natsWrapper.client);
  const data: Events.EventTypes.TicketCreated["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vetusta Morla",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  return { message, data, listener };
};

it("should succesfuly create a ticket into the database", async () => {
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
