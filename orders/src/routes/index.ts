import express from "express";

import { newRoute } from "./new";
import { showRoute } from "./show";
import { allRoute } from "./all";
import { cancelRoute } from "./cancel";

const routes = express.Router();

routes.use(newRoute);
routes.use(showRoute);
routes.use(allRoute);
routes.use(cancelRoute);

export default routes;
