import { Router } from "express";
import * as userCtrl from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';
import { canUpdateUser } from "../middlewares/self.middleware";
import { validate } from '../middlewares/validate.middleware';
import { validateObjectId } from '../middlewares/validateObjectId.middleware';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user (public registration)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", validate(createUserSchema), userCtrl.create);

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Get own user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns logged-in user's profile
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticate, userCtrl.getProfile);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get list of all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/", authenticate, isAdmin, userCtrl.list);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       400:
 *         description: Invalid ObjectId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, isAdmin, validateObjectId('id'), userCtrl.getOne);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update a user (Admin or self)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation or bad input error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - cannot update user
 *       404:
 *         description: User not found
 */
router.put('/:id', authenticate, validateObjectId('id'), canUpdateUser, validate(updateUserSchema), userCtrl.update);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid ObjectId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticate, isAdmin, validateObjectId('id'), userCtrl.remove);

export default router;