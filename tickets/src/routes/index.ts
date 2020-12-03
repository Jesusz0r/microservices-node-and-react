import express from "express";

import { newRoute } from "./new";
import { showRoute } from "./show";

const routes = express.Router();

routes.use(newRoute);
routes.use(showRoute);

export default routes;
