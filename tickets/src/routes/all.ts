import express, { Request, Response } from "express";

import { Ticket } from "../models";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined });

  res.send({ tickets });
});

export { router as allRoute };
