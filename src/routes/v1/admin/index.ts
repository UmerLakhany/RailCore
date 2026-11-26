import express, { Router } from "express";

import authRoute from "./auth";
import usersRoute from "./user";
import ordersRoute from "./order";
import categoriesRoute from "./categories";
import AuthMiddleware from "../../../auth/jwt";


const router: Router = express.Router();

router.use('/auth', authRoute);
router.use('/users', AuthMiddleware.auth, usersRoute);
router.use('/categories', AuthMiddleware.auth, categoriesRoute);
router.use('/orders', AuthMiddleware.auth, ordersRoute);

export default router;