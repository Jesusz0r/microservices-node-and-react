import { Request, Response, NextFunction } from "express";
import { Errors } from "@encuentradepa/common";

import { Ticket } from "../models";

const checkTicketOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const ticket = await Ticket.findOne({ _id: id, userId });

  if (!ticket) {
    throw new Errors.NotAuthorizedError("Unauthorized.");
  }

  next();
};

export { checkTicketOwnership };
