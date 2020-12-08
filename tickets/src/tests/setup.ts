import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { app } from "../app";

let mongo: any;

jest.mock("../nats-wrapper");
jest.mock("../middlewares");

beforeAll(async () => {
  process.env.JWT_SECRET = "asdasd";

  mongo = new MongoMemoryServer();

  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
