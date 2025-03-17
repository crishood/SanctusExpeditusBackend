import { Router } from 'express';
import { API_ROUTES } from '@app/core/constants/api';
import { RouteController } from '@app/features/routes/RouteController';
import { RouteService } from '@app/features/routes/RouteService';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *     ForbiddenError:
 *       description: Insufficient permissions to access this resource
 */

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Route management endpoints
 */

/**
 * @swagger
 * /api/routes/{id}/status:
 *   patch:
 *     summary: Update route status
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID
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
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Route status updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Route not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/routes/:id/current-stop:
 *   patch:
 *     summary: Update route current stop
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Route ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_stop
 *             properties:
 *               current_stop:
 *                 type: string
 *                 description: New current stop
 *     responses:
 *       200:
 *         description: Route current stop updated successfully
 *       404:
 *         description: Route not found
 *       500:
 *         description: Server error
 */

const router = Router();
const routeController = new RouteController(new RouteService());

export default router;
