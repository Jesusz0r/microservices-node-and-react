import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors";
import { User } from "../models";
import { validateRequest } from "../middlewares";

const router = express.Router();

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email is required."),
    body("password").isLength({ min: 5 }).withMessage("Password is incorrect."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("Invalid credentials. Please try again.");
    }

    const isCorrectPassword = await user.comparePassword(password);

    if (!isCorrectPassword) {
      throw new BadRequestError("Invalid credentials. Please try again.");
    }

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7 days",
      }
    );

    req.session = { ...req.session, jwt: token };
    res.status(200).send({ token, user });
  }
);

export { router as signinRoute };
