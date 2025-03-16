import { Router } from 'express';
import { OrderController } from './OrderController';
import { OrderService } from './OrderService';
import { API_ROUTES } from '@app/core/constants/api';
import { authenticate } from '@app/core/middlewares/auth/authMiddleware';
import { authorize } from '@app/core/middlewares/auth/roleMiddleware';
import { UserRole } from '@app/core/models/User.model';
import { OrderValidators } from '@app/core/middlewares/orders/orderMiddleware';
import { MySQLOrderRepository } from './MySQLOrderRepository';
const router = Router();
const orderController = new OrderController(new OrderService());
const orderValidators = new OrderValidators(new MySQLOrderRepository());
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
  orderValidators.validateCreateOrderInput.bind(orderValidators),
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
  orderValidators.validateOrderAndRoute.bind(orderValidators),
  orderController.updateOrderRoute.bind(orderController),
  orderController.updateTransporterCapacity.bind(orderController)
);

export default router;
