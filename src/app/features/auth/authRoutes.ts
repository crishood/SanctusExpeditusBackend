import { Router } from 'express';
import { AuthController } from './AuthController';
import { API_ROUTES } from '@app/core/constants/api';
import { AuthService } from './AuthService';
import { AuthValidators } from './validators/authValidators';
import { MySQLAuthRepository } from './MySQLAuthRepository';

const router = Router();
const authController = new AuthController(new AuthService());
const authValidators = new AuthValidators(new MySQLAuthRepository());

router.post(
  API_ROUTES.AUTH.REGISTER,
  AuthValidators.validateRegisterInput,
  authValidators.validateNewUser.bind(authValidators),
  authController.register.bind(authController)
);
router.post(
  API_ROUTES.AUTH.LOGIN,
  AuthValidators.validateLoginInput,
  authValidators.validateCredentials.bind(authValidators),
  authController.login.bind(authController)
);

export default router;
