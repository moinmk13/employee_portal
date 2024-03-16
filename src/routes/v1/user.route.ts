import express, { Router } from "express";
import userController from "../../controllers/user.controller";
const router: Router = express.Router();

router.get("/", userController.getUsers);
router.get("/user_by_Id/:userId", userController.getUserById);
router.delete("/:userId", userController.deleteUser);
router.get("/search", userController.searchUsers);

export default router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       "200":
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /user/user_by_Id/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to get
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: A single user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "404":
 *         description: User not found
 */

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: User deleted successfully
 *       "404":
 *         description: User not found
 */

/**
 * @swagger
 * /user/search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         description: Query string for searching users
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: A list of users matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

