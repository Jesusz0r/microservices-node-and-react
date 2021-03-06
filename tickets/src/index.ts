import mongoose from "mongoose";

import { app } from "./app";
import { OrderCreated, OrderCancelled } from "./events/listeners";
import { natsWrapper } from "./nats-wrapper";

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is required.");
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error("NATS_CLUSTER_ID environment variable is required.");
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error("NATS_CLIENT_ID environment variable is required.");
    }
    if (!process.env.NATS_URI) {
      throw new Error("NATS_URI environment variable is required.");
    }

    await app.listen(8000);

    const nats = await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );
    nats.on("close", () => {
      console.log("NATS connection closed!");
      process.exit(0);
    });
    process.on("SIGINT", () => nats.close());
    process.on("SIGTERM", () => nats.close());

    const orderCreatedListener = new OrderCreated(natsWrapper.client);
    const orderCancelledListener = new OrderCancelled(natsWrapper.client);

    orderCreatedListener.listen();
    orderCancelledListener.listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("Server is up and running on port: 8000");
    console.log("Connected to the database!");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

start();
