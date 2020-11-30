import { Request, Response, NextFunction } from "express";

import { CustomError } from "../errors";

// Si recibe 4 argumentos significa que es para capturar los errores
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    const errors = err.serializeErrors();

    return res.status(err.statusCode).send({ errors });
  }

  res.status(500).send({ errors: [{ message: "Something went wrong!" }] });
};
