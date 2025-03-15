import { Router } from 'express';
import { UserController } from './UserController';
import { API_ROUTES } from '@app/core/constants/api';
import { UserService } from './UserService';

const router = Router();
const userController = new UserController(new UserService());

router.get(
  API_ROUTES.USERS.GET_USERS,
  userController.getUsers.bind(userController)
);

router.get(
  API_ROUTES.USERS.GET_USER_BY_ID,
  userController.getUserById.bind(userController)
);

router.get(
  API_ROUTES.USERS.GET_USER_BY_EMAIL,
  userController.getUserByEmail.bind(userController)
);

router.patch(
  API_ROUTES.USERS.UPDATE_USER,
  userController.updateUser.bind(userController)
);

router.delete(
  API_ROUTES.USERS.DELETE_USER,
  userController.deleteUser.bind(userController)
);
export default router;
