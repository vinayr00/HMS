import { Router } from 'express';
import { getMine, updateStatus } from '../controllers/taskController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

router.use(verifyToken);

router.get('/', requireRole('staff'), getMine);
router.patch('/:id/status', requireRole('staff'), updateStatus);

export default router;
