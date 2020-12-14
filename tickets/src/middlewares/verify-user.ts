import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { Errors } from "@encuentradepa/common";

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get(
      "http://auth-service:8000/api/users/current",
      { headers: { Cookie: req.headers.cookie } }
    );

    if (!response.data.user) {
      throw new Errors.NotAuthorizedError("Invalid credentials.");
    }

    req.user = response.data.user;

    next();
  } catch (error) {
    throw new Errors.BadRequestError(error.message);
  }
};

export { verifyUser };
