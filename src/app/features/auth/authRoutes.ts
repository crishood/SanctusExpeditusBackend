import { Router } from 'express';
import { AuthController } from './AuthController';
import { API_ROUTES } from '@app/core/constants/api';
import { AuthService } from './AuthService';
import { MySQLAuthRepository } from './MySQLAuthRepository';

const router = Router();
const authController = new AuthController(
  new AuthService(new MySQLAuthRepository())
);

router.post(API_ROUTES.AUTH.REGISTER, authController.register);
router.post(API_ROUTES.AUTH.LOGIN, authController.login);

export default router;
