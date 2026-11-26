import express, { Router } from "express";
import UserService from "../../../services/user.service";
import RegisterDTO from "../../../dto/classes/CustomerRegister.dto";
import validateDTO from "../../../dto/middlewares";

const router: Router = express.Router();


router.post("/login", UserService.vendorLogin);
router.post("/change-password", UserService.changePassword);
router.post("/resend-otp", UserService.resendOtp);
router.post("/forgot-password", UserService.forgotPassword);
router.post("/reset-password", UserService.resetPassword);

router.post("/register", validateDTO(RegisterDTO), UserService.vendorRegister);
router.get("/", (req, res) => {
  res.send("Welcome ");
});


export default router;