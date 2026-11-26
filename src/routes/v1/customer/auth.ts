import express, { Router } from "express";
import UserService from "../../../services/user.service";
// import AuthMiddleware from "../../../auth/jwt";
import RegisterDTO from "../../../dto/classes/CustomerRegister.dto";
import validateDTO from "../../../dto/middlewares";

const router: Router = express.Router();


router.post("/login", UserService.customerLogin);
router.post("/forgot-password", UserService.forgotPassword);
router.post("/change-password", UserService.changePassword);
router.post("/reset-password", UserService.resetPassword);
// router.post("/resend-otp", UserService.resendOtp);
router.post("/register", validateDTO(RegisterDTO), UserService.customerRegister);
router.post("/sso/google", UserService.googleSSOLogin);
router.post("/sso/facebook", UserService.fbSSOLogin);
router.get("/", (req, res) => {
  res.send("Welcome ");
});


export default router;