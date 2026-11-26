import express, { Router } from "express";

import authRoute from "./auth";
import VendorService from "../../../services/vendor.service";
import AuthMiddleware from "../../../auth/jwt";

const router: Router = express.Router();

router.use('/auth', authRoute);

router.get('/dashboard', AuthMiddleware.auth, VendorService.getDashboardData);

export default router;