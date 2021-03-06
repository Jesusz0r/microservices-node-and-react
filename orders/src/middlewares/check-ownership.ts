import { Request, Response, NextFunction } from "express";
import { Errors } from "@encuentradepa/common";

import { Order } from "../models";

declare global {
  namespace Express {
    interface Request {
      order?: any;
    }
  }
}

const checkOrderOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const order = await Order.findOne({ _id: id, userId });

  if (!order) {
    throw new Errors.NotAuthorizedError("Unauthorized.");
  }

  req.order = order;

  next();
};

export { checkOrderOwnership };
