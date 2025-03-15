import { Router } from 'express';
import { OrderController } from './OrderController';
import { OrderService } from './OrderService';
import { API_ROUTES } from '@app/core/constants/api';
import { authenticate } from '@app/core/middleware/auth/authMiddleware';
import { authorize } from '@app/core/middleware/auth/roleMiddleware';
import { UserRole } from '@app/core/models/User.model';

const router = Router();
const orderController = new OrderController(new OrderService());

router.get(
  API_ROUTES.ORDERS.GET_ORDERS,
  authenticate,
  authorize([UserRole.ADMIN]),
  orderController.getOrders.bind(orderController)
);

router.get(
  API_ROUTES.ORDERS.GET_ORDER_BY_ID,
  authenticate,
  authorize([UserRole.ADMIN, UserRole.CUSTOMER]),
  orderController.getOrderById.bind(orderController)
);

router.post(
  API_ROUTES.ORDERS.CREATE_ORDER,
  authenticate,
  authorize([UserRole.CUSTOMER]),
  orderController.createOrder.bind(orderController)
);

router.patch(
  API_ROUTES.ORDERS.UPDATE_ORDER_STATUS,
  authenticate,
  authorize([UserRole.ADMIN]),
  orderController.updateOrderStatus.bind(orderController)
);

router.patch(
  API_ROUTES.ORDERS.UPDATE_ORDER_ROUTE,
  authenticate,
  authorize([UserRole.ADMIN]),
  orderController.updateOrderRoute.bind(orderController)
);

export default router;
