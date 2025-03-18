import { API_ROUTES } from '@app/core/constants/api';
import { AuthController } from '@app/features/auth/AuthController';
import { AuthService } from '@app/features/auth/AuthService';
import { Router } from 'express';

const authController = new AuthController(new AuthService());

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUserDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: test@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: "Test123!"
 *         name:
 *           type: string
 *           example: "Test User"
 *
 *     LoginUserDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: test@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: "Test123!"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "123e4567-e89b-12d3-a456-426614174000"
 *             email:
 *               type: string
 *               example: "test@example.com"
 *             name:
 *               type: string
 *               example: "Test User"
 */

router.post(
  API_ROUTES.AUTH.REGISTER,
  authController.register.bind(authController)
);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserDto'
 *           examples:
 *             validUser:
 *               summary: Valid User Registration
 *               value:
 *                 email: "test@example.com"
 *                 password: "Test123!"
 *                 name: "Test User"
 *             invalidEmail:
 *               summary: Invalid Email Format
 *               value:
 *                 email: "invalid-email"
 *                 password: "Test123!"
 *                 name: "Test User"
 *             weakPassword:
 *               summary: Weak Password
 *               value:
 *                 email: "test@example.com"
 *                 password: "123"
 *                 name: "Test User"
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 email: "test@example.com"
 *                 name: "Test User"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             examples:
 *               invalidEmail:
 *                 summary: Invalid Email Format
 *                 value:
 *                   message: "Invalid email format"
 *                   status: 400
 *               weakPassword:
 *                 summary: Weak Password
 *                 value:
 *                   message: "Password must be at least 6 characters long"
 *                   status: 400
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             example:
 *               message: "Email already registered"
 *               status: 409
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDto'
 *           examples:
 *             validLogin:
 *               summary: Valid Login Credentials
 *               value:
 *                 email: "test@example.com"
 *                 password: "Test123!"
 *             invalidCredentials:
 *               summary: Invalid Credentials
 *               value:
 *                 email: "test@example.com"
 *                 password: "wrongpassword"
 *             invalidFormat:
 *               summary: Invalid Email Format
 *               value:
 *                 email: "invalid-email"
 *                 password: "Test123!"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 email: "test@example.com"
 *                 name: "Test User"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             examples:
 *               invalidFormat:
 *                 summary: Invalid Email Format
 *                 value:
 *                   message: "Invalid email format"
 *                   status: 400
 *               missingFields:
 *                 summary: Missing Required Fields
 *                 value:
 *                   message: "Email and password are required"
 *                   status: 400
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid credentials"
 *               status: 401
 */

export default router;
