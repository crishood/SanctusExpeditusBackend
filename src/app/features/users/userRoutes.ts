import { Router } from 'express';
import { getUsers } from './UserController';
import { API_ROUTES } from '@app/core/constants/api';

const router = Router();

router.get(API_ROUTES.USERS.GET_USERS, getUsers);

export default router;
