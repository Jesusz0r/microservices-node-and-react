import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    email: "test@test.com",
    id: new mongoose.Types.ObjectId(),
  };

  return next();
};

export { verifyUser };
