import { Request, Response, NextFunction } from "express";

const checkTicketOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};

export { checkTicketOwnership };
