import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

// We create this id in here so we have a single id no matter how many times verifyUser is called during a test.
export const userId = new mongoose.Types.ObjectId();

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    email: "test@test.com",
    id: userId,
  };

  return next();
};

export { verifyUser };
