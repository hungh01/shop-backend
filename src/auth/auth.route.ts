import { Router } from 'express';
import * as authController from './auth.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { SignUpRequest } from './dto/signup.request';
import { LoginRequest } from './dto/login.request';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, authController.getUser);
router.post('/signup', validateRequest(SignUpRequest), authController.signUp);
router.post('/login', validateRequest(LoginRequest), authController.logIn);
router.post('/logout', authController.logOut);
router.post('/refresh-token', authController.refreshToken);


export default router;
