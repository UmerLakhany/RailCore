import express, { Router } from "express";
import authRoute from "../customer/auth";
import AuthMiddleware from "../../../auth/jwt";
import validateDTO from "../../../dto/middlewares";
import CustomerProfileDto from "../../../dto/classes/CustomerProfile.dto";
import UserService from "../../../services/user.service";

const router: Router = express.Router();

router.use('/auth', authRoute)
router.put('/profile', AuthMiddleware.auth, validateDTO(CustomerProfileDto), UserService.updateProfile)
router.get('/', (req, res) => {
  res.send('Admin route is working!');
});

export default router;