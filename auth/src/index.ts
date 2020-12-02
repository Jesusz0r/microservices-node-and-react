import mongoose from "mongoose";

import { app } from "./app";

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required.");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is required.");
  }

  try {
    await app.listen(8000);
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
