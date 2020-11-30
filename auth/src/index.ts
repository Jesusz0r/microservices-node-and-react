import mongoose from "mongoose";

import { app } from "./app";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required.");
}

async function start() {
  try {
    await app.listen(8000);
    await mongoose.connect("mongodb://auth-mongo-service:27017/auth", {
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
