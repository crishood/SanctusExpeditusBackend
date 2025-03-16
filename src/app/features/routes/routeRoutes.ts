import { Router } from 'express';
import { RouteController } from './RouteController';
import { RouteService } from './RouteService';
import { API_ROUTES } from '@app/core/constants/api';
import { authenticate } from '@app/core/middlewares/auth/authMiddleware';
import { authorize } from '@app/core/middlewares/auth/roleMiddleware';
import { UserRole } from '@app/core/models/User.model';

const router = Router();
const routeController = new RouteController(new RouteService());

router.patch(
  API_ROUTES.ROUTES.UPDATE_ROUTE_STATUS,
  authenticate,
  authorize([UserRole.ADMIN]),
  routeController.updateRouteStatus.bind(routeController)
);

router.patch(
  API_ROUTES.ROUTES.UPDATE_ROUTE_CURRENT_STOP,
  authenticate,
  authorize([UserRole.ADMIN]),
  routeController.updateRouteCurrentStop.bind(routeController)
);

export default router;
