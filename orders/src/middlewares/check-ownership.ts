import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "@encuentradepa/common";

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

  console.log("order:", order);

  if (!order) {
    throw new NotAuthorizedError("Unauthorized.");
  }

  req.order = order;

  next();
};

export { checkOrderOwnership };
