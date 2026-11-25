import express, { Router } from 'express';
import asyncHandler from '../../common/asyncHandler';
import validateDTO from '../../dto/middlewares';
import RegisterDTO from '../../dto/classes/Register.dto';
import LoginDTO from '../../dto/classes/Login.dto';
import AuthService from '../../services/auth.service';

const router: Router = express.Router();

router.post('/register', validateDTO(RegisterDTO), asyncHandler(AuthService.register));
router.post('/login', validateDTO(LoginDTO), asyncHandler(AuthService.login));

export default router;
