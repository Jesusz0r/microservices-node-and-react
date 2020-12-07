import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is required.");
    }

    await app.listen(8000);

    const nats = await natsWrapper.connect(
      "ticketing",
      "tickets123",
      "http://nats-service:4222"
    );
    nats.on("close", () => {
      console.log("NATS connection closed!");
      process.exit(0);
    });
    process.on("SIGINT", () => nats.close());
    process.on("SIGTERM", () => nats.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Server is up and running on port: 8000");
    console.log("Connected to the database!");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

start();
