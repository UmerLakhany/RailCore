import express, { Router } from "express";
import UserService from "../../../services/user.service";
// import AuthMiddleware from "../../../auth/jwt";
import RegisterDTO from "../../../dto/classes/RiderRegister.dto";
import validateDTO from "../../../dto/middlewares";

const router: Router = express.Router();


router.post("/login", UserService.riderLogin);
router.post("/change-password", UserService.changePassword);
router.post("/resend-otp", UserService.resendOtp);
router.post("/forgot-password", UserService.forgotPassword);
router.post("/reset-password", UserService.resetPassword);

router.post("/register", validateDTO(RegisterDTO), UserService.riderRegister);
router.get("/", (req, res) => {
  res.send("Welcome ");
});


export default router;