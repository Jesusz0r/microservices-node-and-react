import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "@encuentradepa/common";

// import { Ticket } from "../models";

const checkTicketOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  // const ticket = await Ticket.findOne({ _id: id, userId });

  // if (!ticket) {
  //   throw new NotAuthorizedError("Unauthorized.");
  // }

  next();
};

export { checkTicketOwnership };
