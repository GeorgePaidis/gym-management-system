import { Router } from "express";
import * as authCtrl from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { register } from "../controllers/auth.controller";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *  post:
 *    summary: Register new user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              firstname:
 *                type: string
 *              lastname:
 *                type: string
 *              phone:
 *                type: string
 *            required:
 *              - email
 *              - password
 *              - firstname
 *              - lastname
 *    responses:
 *      201:
 *        description: User created successfully
 *      400:
 *        description: Validation error
 */
router.post("/register", validate(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *  post:
 *    summary: Login user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: Login success
 *      401:
 *        description: Invalid credentials
 */
router.post('/login', validate(loginSchema), authCtrl.login);

export default router;