import express, { Router } from "express";
import UserService from "../../../services/user.service";
// import AuthMiddleware from "../../../auth/jwt";
import RegisterDTO from "../../../dto/classes/CustomerRegister.dto";
import validateDTO from "../../../dto/middlewares";

const router: Router = express.Router();


router.post("/login", UserService.adminLogin);
router.post("/change-password", UserService.changePassword);
router.post("/sso/google", UserService.googleSSOLogin);
// router.post("/register", validateDTO(RegisterDTO), UserService.adminRegister);
router.post("/sso/facebook", UserService.fbSSOLogin);
router.post("/forgot-password", UserService.forgotPassword);
router.post("/reset-password", UserService.resetPassword);
router.get("/", (req, res) => {
  res.send("Welcome to SGLP Admin Auth API");
});


export default router;