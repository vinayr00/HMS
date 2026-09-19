import { Router } from 'express';
import { login, me } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.get('/me', verifyToken, me);

export default router;
