import express, { Request, Response } from "express";
import { body } from "express-validator";
import { NotFoundError, validateRequest } from "@encuentradepa/common";

import { verifyUser, checkTicketOwnership } from "../middlewares";
import { Ticket } from "../models";

const router = express.Router();

router.put(
  "/:id",
  [
    body("title").optional().isLength({ min: 5 }).withMessage("Invalid title."),
    body("price").optional().isFloat({ gt: 0 }).withMessage("Invalid price."),
  ],
  verifyUser,
  checkTicketOwnership,
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const ticket = await Ticket.findOneAndUpdate(
      { _id: id },
      { title, price },
      { new: true, omitUndefined: true }
    );

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send({ ticket });
  }
);

export { router as updateRoute };
