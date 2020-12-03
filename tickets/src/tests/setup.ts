import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { app } from "../app";

let mongo: any;

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
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
