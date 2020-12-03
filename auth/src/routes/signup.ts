import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@encuentradepa/common";

import { User } from "../models";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email is invalid."),
    body("password").isLength({ min: 5 }).withMessage("Password is invalid."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Invalid credentials. Please try again.");
    }

    const user = User.build({ email, password });
    await user.hashPassword(password);
    await user.save();

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7 days",
      }
    );

    req.session = { ...req.session, jwt: token };
    res.status(201).send({ user: user.toJSON(), token });
  }
);

export { router as signupRoute };
