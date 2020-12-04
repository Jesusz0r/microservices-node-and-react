import express from "express";

import { newRoute } from "./new";
import { showRoute } from "./show";
import { allRoute } from "./all";
import { updateRoute } from "./update";

const routes = express.Router();

routes.use(newRoute);
routes.use(showRoute);
routes.use(allRoute);
routes.use(updateRoute);

export default routes;
