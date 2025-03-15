import { Router } from 'express';
import { AuthController } from './AuthController';
import { API_ROUTES } from '@app/core/constants/api';
import { AuthService } from './AuthService';
import { AuthValidators } from './validators/authValidators';

const router = Router();
const authController = new AuthController(new AuthService());

router.post(
  API_ROUTES.AUTH.REGISTER,
  AuthValidators.validateRegisterInput,
  authController.register.bind(authController)
);
router.post(
  API_ROUTES.AUTH.LOGIN,
  AuthValidators.validateLoginInput,
  authController.login.bind(authController)
);

export default router;
