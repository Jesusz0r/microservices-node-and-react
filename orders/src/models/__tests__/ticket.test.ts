import mongoose from "mongoose";

import { Ticket } from "../ticket";

it("should throw an error when trying to update ticket with outdated version", async () => {
  let error = null;
  const id = new mongoose.Types.ObjectId().toHexString();

  // Creamos un ticket en la base de datos
  await Ticket.build({
    title: "vetusta morla",
    price: 10,
    id,
  });

  // Obtenemos el mismo ticket dos veces para luego intentar actualizarlo dos veces.
  // En el primer guardado podremos modificar el ticket corretamente pero la segunda vez
  // que lo intentemos nos dará un error, ya que el ticket que tenemos en memoria dejará de ser valido
  // por que su versión cambió y el que tenemos en memoria tiene la versión anterior.
  const firstFectchTicket = await Ticket.findOne({ _id: id });
  const secondFectchTicket = await Ticket.findOne({ _id: id });

  // Modificamos el precio y guardamos el ticket la primera vez
  firstFectchTicket!.set("price", 15);
  await firstFectchTicket!.save();

  // Modificamos el precio y guardamos el mismo ticket una segunda vez y esperamos que haga throw
  firstFectchTicket!.set("price", 10);

  try {
    await secondFectchTicket!.save();
  } catch (err) {
    error = err;
  }

  expect(error).not.toBeNull();
});

it("should increment ticket version when succesfuly saved", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = await Ticket.build({
    title: "vetusta morla",
    price: 10,
    id,
  });

  ticket.set("price", 15);
  await ticket.save();

  expect(ticket.version).toBe(1);
});
