import mongoose from "mongoose";

import { app } from "./app";

async function start() {
  try {
    await app.listen(8000);
    await mongoose.connect("mongodb://tickets-mongo-service:27017/tickets", {
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
