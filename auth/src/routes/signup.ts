import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models";
import { RequestValidationError, BadRequestError } from "../errors";

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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("UserAlreadyExistsError");
    }

    const user = User.build({ email, password });
    await user.hashPassword(password);
    await user.save();

    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7 days",
      }
    );

    req.session = { ...req.session, token };
    res.send({ user: user.toJSON(), token });
  }
);

export { router as signupRoute };
