import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors";
import { User } from "../models";
import { validateRequest } from "../middlewares";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Must use a valid email."),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must have at least 5 caracters."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("UserAlreadyExistsError");
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

    req.session = { ...req.session, token };
    res.status(201).send({ user: user.toJSON(), token });
  }
);

export { router as signupRoute };
