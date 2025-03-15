import { Router } from 'express';
import { UserController } from './UserController';
import { API_ROUTES } from '@app/core/constants/api';
import { UserService } from './UserService';
import { UserValidators } from '@app/core/middlewares/users/userMiddleware';
import { authenticate } from '@app/core/middlewares/auth/authMiddleware';
import { authorize } from '@app/core/middlewares/auth/roleMiddleware';
import { UserRole } from '@app/core/models/User.model';
const router = Router();
const userController = new UserController(new UserService());

router.get(
  API_ROUTES.USERS.GET_USERS,
  authenticate,
  authorize([UserRole.ADMIN]),
  userController.getUsers.bind(userController)
);

router.get(
  API_ROUTES.USERS.GET_USER_BY_ID,
  authenticate,
  authorize([UserRole.ADMIN]),
  userController.getUserById.bind(userController)
);

router.get(
  API_ROUTES.USERS.GET_USER_BY_EMAIL,
  authenticate,
  authorize([UserRole.ADMIN]),
  userController.getUserByEmail.bind(userController)
);

router.patch(
  API_ROUTES.USERS.UPDATE_USER,
  authenticate,
  authorize([UserRole.ADMIN, UserRole.CUSTOMER]),
  UserValidators.validateUpdateUserInput,
  userController.updateUser.bind(userController)
);

router.delete(
  API_ROUTES.USERS.DELETE_USER,
  authenticate,
  authorize([UserRole.ADMIN]),
  userController.deleteUser.bind(userController)
);
export default router;
