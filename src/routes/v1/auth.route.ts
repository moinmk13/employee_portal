import express, { Router } from 'express';
import AuthController from '../../controllers/auth.controllers';
const router: Router = express.Router();

router.post('/register', AuthController.signUp);
router.post('/login', AuthController.signIn);

export default router;


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/send-verification-code:
 *   post:
 *     summary: Send verification code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phone_number
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               phone_number:
 *                 type: string
 *                 description: User's phone number
 *             example:
 *               email: pavel@phoenix.com
 *               phone_number: "+1234567890"
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 'The verification code has been sent to your email or phone'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
