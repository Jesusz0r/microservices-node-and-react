import express from "express";
import "express-async-errors";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { authRoutes } from "./routes";
import { errorHandler } from "./middlewares";
import { NotFoundError } from "./errors";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    signed: false,
    secure: true,
  })
);
app.use(morgan("dev"));

app.use("/api/users", authRoutes);
app.use(errorHandler);

app.all("*", (req, res, next) => {
  const notFoundError = new NotFoundError();
  const errors = notFoundError.serializeErrors();

  res.status(notFoundError.statusCode).send({ errors });
});

if (!process.env.JWT_SECRET) {
  throw new Error("");
}

app.listen(8000, async () => {
  console.log("Listening on port: 8000!");

  try {
    await mongoose.connect("mongodb://auth-mongo-service:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to the database!");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
});
