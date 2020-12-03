import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import { BadRequestError, NotAuthorizedError } from "@encuentradepa/common";

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "test") {
    req.user = {
      email: "test@test.com",
      id: new mongoose.Types.ObjectId(),
    };

    return next();
  }

  try {
    const response = await axios.get(
      "http://auth-service:8000/api/users/current",
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      }
    );

    if (!response.data.user) {
      throw new NotAuthorizedError("Invalid credentials.");
    }

    req.user = response.data.user;

    next();
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export { verifyUser };
