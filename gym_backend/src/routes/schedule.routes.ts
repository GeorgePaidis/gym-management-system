import { Router } from "express";
import * as scheduleCtrl from '../controllers/schedule.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';
import { validate } from '../middlewares/validate.middleware';
import { addClassSchema, removeClassSchema } from '../validators/schedule.validator';

const router = Router();

/**
 * @openapi
 * /schedule:
 *   get:
 *     summary: Get full schedule
 *     tags: [Schedule]
 *     responses:
 *       200:
 *         description: Returns the complete schedule
 */
router.get("/", scheduleCtrl.get);

/**
 * @openapi
 * /schedule:
 *   put:
 *     summary: Update the entire schedule (Admin only)
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not an admin
 */
router.put("/", authenticate, isAdmin, scheduleCtrl.update);

/**
 * @openapi
 * /schedule/add-class:
 *   post:
 *     summary: Add a class to the schedule (Admin only)
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - time
 *               - name
 *             properties:
 *               day:
 *                 type: string
 *               time:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not an admin
 */
router.post("/add-class", authenticate, isAdmin, validate(addClassSchema), scheduleCtrl.addClass);

/**
 * @openapi
 * /schedule/remove-class:
 *   post:
 *     summary: Remove a class from the schedule (Admin only)
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - time
 *             properties:
 *               day:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class removed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not an admin
 */
router.post("/remove-class", authenticate, isAdmin, validate(removeClassSchema), scheduleCtrl.removeClass);

export default router;