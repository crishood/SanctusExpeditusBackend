import { API_ROUTES } from '@app/core/constants/api';
import { authenticate } from '@app/core/middlewares/auth/authMiddleware';
import { authorize } from '@app/core/middlewares/auth/roleMiddleware';
import { UserRole } from '@app/core/models/User.model';
import { OrderController } from '@app/features/orders/OrderController';
import { OrderService } from '@app/features/orders/OrderService';
import { Router } from 'express';

const router = Router();
const orderController = new OrderController(new OrderService());

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - weight
 *         - length
 *         - width
 *         - height
 *         - product_type
 *         - delivery_city
 *         - destination_address
 *       properties:
 *         id:
 *           type: string
 *           description: Order unique identifier
 *         user_id:
 *           type: string
 *           description: ID of the user who created the order
 *         weight:
 *           type: number
 *           description: Weight of the package in kilograms
 *         length:
 *           type: number
 *           description: Length of the package in centimeters
 *         width:
 *           type: number
 *           description: Width of the package in centimeters
 *         height:
 *           type: number
 *           description: Height of the package in centimeters
 *         product_type:
 *           type: string
 *           description: Type of product being shipped
 *         delivery_city:
 *           type: string
 *           description: City where the package will be delivered
 *         destination_address:
 *           type: string
 *           description: Delivery destination address
 *         status:
 *           type: string
 *           enum: [pending, in_transit, completed, canceled]
 *           description: Current status of the order
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the order was created
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     description: |
 *       Retrieve a list of all orders in the system.
 *       Requires authentication and ADMIN role.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     x-permissions:
 *       - ADMIN
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get(
  API_ROUTES.ORDERS.GET_ORDERS,
  authenticate,
  authorize([UserRole.ADMIN]),
  orderController.getOrders.bind(orderController)
);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: |
 *       Retrieve details of a specific order.
 *       Requires authentication and either ADMIN or CUSTOMER role.
 *       Customers can only access their own orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     x-permissions:
 *       - ADMIN
 *       - CUSTOMER (own orders only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Order not found
 */
router.get(
  API_ROUTES.ORDERS.GET_ORDER_BY_ID,
  authenticate,
  authorize([UserRole.ADMIN, UserRole.CUSTOMER]),
  orderController.getOrderById.bind(orderController)
);

/**
 * @swagger
 * /orders/{id}/status-history:
 *   get:
 *     summary: Get order status history
 *     description: |
 *       Retrieve the status history of a specific order.
 *       Requires authentication and either ADMIN or CUSTOMER role.
 *       Customers can only access their own orders' history.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     x-permissions:
 *       - ADMIN
 *       - CUSTOMER (own orders only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order status history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         enum: [pending, in_transit, completed, canceled]
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Order not found
 */
router.get(
  API_ROUTES.ORDERS.GET_ORDER_STATUS_HISTORY,
  authenticate,
  authorize([UserRole.ADMIN, UserRole.CUSTOMER]),
  orderController.getOrderStatusHistory.bind(orderController)
);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: |
 *       Create a new order in the system.
 *       Requires authentication and CUSTOMER role.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     x-permissions:
 *       - CUSTOMER
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weight
 *               - length
 *               - width
 *               - height
 *               - product_type
 *               - delivery_city
 *               - destination_address
 *             properties:
 *               weight:
 *                 type: number
 *                 description: Weight in kilograms
 *               length:
 *                 type: number
 *                 description: Length in centimeters
 *               width:
 *                 type: number
 *                 description: Width in centimeters
 *               height:
 *                 type: number
 *                 description: Height in centimeters
 *               product_type:
 *                 type: string
 *                 description: Type of product being shipped
 *               delivery_city:
 *                 type: string
 *                 description: City where the package will be delivered
 *               destination_address:
 *                 type: string
 *                 description: Complete delivery address
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Customer access required
 *       400:
 *         description: Bad Request - Invalid input data
 */
router.post(
  API_ROUTES.ORDERS.CREATE_ORDER,
  authenticate,
  authorize([UserRole.CUSTOMER]),
  orderController.createOrder.bind(orderController)
);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     description: |
 *       Update the status of a specific order.
 *       Requires authentication and ADMIN role.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     x-permissions:
 *       - ADMIN
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_transit, completed, canceled]
 *                 description: New status for the order
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 */
router.patch(
  API_ROUTES.ORDERS.UPDATE_ORDER_STATUS,
  authenticate,
  authorize([UserRole.ADMIN]),
  orderController.updateOrderStatus.bind(orderController)
);

/**
 * @swagger
 * /orders/{id}/route:
 *   patch:
 *     summary: Update order route
 *     description: |
 *       Assign or update the delivery route for a specific order.
 *       Requires authentication and ADMIN role.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     x-permissions:
 *       - ADMIN
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - route_id
 *             properties:
 *               route_id:
 *                 type: string
 *                 description: ID of the route to assign
 *     responses:
 *       200:
 *         description: Order route updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Transporter capacity updated successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 */
router.patch(
  API_ROUTES.ORDERS.UPDATE_ORDER_ROUTE,
  authenticate,
  authorize([UserRole.ADMIN]),
  orderController.updateOrderRoute.bind(orderController)
);

export default router;
