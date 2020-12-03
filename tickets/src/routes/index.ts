import express from "express";

import { newRoute } from "./new";

const routes = express.Router();

routes.use(newRoute);

export default routes;
