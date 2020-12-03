import express, { Request, Response } from "express";
import { NotFoundError } from "@encuentradepa/common";

import { Ticket } from "../models";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findOne({ _id: id });

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send({ ticket });
});

export { router as showRoute };
