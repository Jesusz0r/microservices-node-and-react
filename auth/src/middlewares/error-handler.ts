import { Request, Response, NextFunction } from "express";

import { CustomError } from "../errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("err:", err);

  if (err instanceof CustomError) {
    const errors = err.serializeErrors();

    return res.status(err.statusCode).send({ errors });
  }

  res.status(500).send({ errors: [{ message: "Something went wrong!" }] });
};
