import express, { Router } from "express";
import authRoute from "../customer/auth";
import addressRoute from "./address";
import AuthMiddleware from "../../../auth/jwt";
import customerOrdersRoute from "./order";
import validateDTO from "../../../dto/middlewares";
import CustomerProfileDto from "../../../dto/classes/CustomerProfile.dto";
import UserService from "../../../services/user.service";

const router: Router = express.Router();

router.use('/auth', authRoute)
router.use("/orders", AuthMiddleware.auth, customerOrdersRoute);
router.use('/address', AuthMiddleware.auth, addressRoute)
router.put('/profile', AuthMiddleware.auth, validateDTO(CustomerProfileDto), UserService.updateProfile)
router.get('/', (req, res) => {
  res.send('Admin route is working!');
});

export default router;