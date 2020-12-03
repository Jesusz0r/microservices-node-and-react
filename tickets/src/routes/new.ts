import { BadRequestError, RequestValidationError } from "@encuentradepa/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "@encuentradepa/common";

import { Ticket } from "../models";
import { verifyUser } from "../middlewares";

const router = express.Router();

router.post(
  "/",
  [
    body("title").trim().isLength({ min: 5 }).withMessage("Title is invalid."),
    body("price").trim().isFloat({ gt: 0 }).withMessage("Price is invalid."),
  ],
  validateRequest,
  verifyUser,
  async (req: Request, res: Response) => {
    try {
      const { id: userId } = req.user;
      const { title, price } = req.body;
      const ticket = await Ticket.create({
        userId,
        title,
        price,
      });

      return res.status(201).send({ ticket });
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }
);

export { router as newRoute };
