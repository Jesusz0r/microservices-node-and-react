import express from "express";
import "express-async-errors";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { Errors, Middlewares } from "@encuentradepa/common";

import routes from "./routes";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(morgan("dev"));

app.use("/api/tickets", routes);
app.use(Middlewares.errorHandler);

app.all("*", (req, res, next) => {
  const notFoundError = new Errors.NotFoundError();
  const errors = notFoundError.serializeErrors();

  res.status(notFoundError.statusCode).send({ errors });
});

export { app };
