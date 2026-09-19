import { Router } from 'express';
import { getAll, create, updateStatus } from '../controllers/appointmentController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

router.use(verifyToken);

router.get('/', requireRole('doctor', 'receptionist', 'admin'), getAll);
router.post('/', requireRole('receptionist'), create);
router.patch('/:id/status', requireRole('doctor', 'receptionist'), updateStatus);

export default router;
