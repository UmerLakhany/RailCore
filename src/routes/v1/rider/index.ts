import express, { Router } from "express";

import authRoute from "./auth";
import AuthMiddleware from "../../../auth/jwt";
import RiderService from "../../../services/rider.service";


const router: Router = express.Router();

router.use('/auth', authRoute);

router.get('/dashboard', AuthMiddleware.auth, RiderService.getDashboardData);

export default router;