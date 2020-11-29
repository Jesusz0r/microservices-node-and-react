import express from "express";

import { currentUserRoute } from "./current-user";
import { signinRoute } from "./signin";
import { signoutRoute } from "./signout";
import { signupRoute } from "./signup";

const router = express.Router();

router.use(currentUserRoute);
router.use(signinRoute);
router.use(signoutRoute);
router.use(signupRoute);

export { router as authRoutes };
