import express from "express";

import { newRoute } from "./new";
import { showRoute } from "./show";
import { allRoute } from "./all";

const routes = express.Router();

routes.use(newRoute);
routes.use(showRoute);
routes.use(allRoute);

export default routes;
