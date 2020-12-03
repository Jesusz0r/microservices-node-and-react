import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "@encuentradepa/common";

import { User } from "../models";

interface UserPayload {
  id: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("req:", req.session);

  const token = req.session?.jwt || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    throw new NotAuthorizedError("User is invalid.");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    const userExists = await User.findOne({ _id: user.id });

    if (!userExists) {
      throw new Error();
    }

    req.user = user;
  } catch (error) {
    req.session = { ...req.session, jwt: token };

    throw new NotAuthorizedError("User is invalid.");
  }

  next();
};
