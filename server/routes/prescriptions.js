import { Router } from 'express';
import { getAll, create, dispense, reject } from '../controllers/prescriptionController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

router.use(verifyToken);

router.get('/', requireRole('doctor', 'pharmacy'), getAll);
router.post('/', requireRole('doctor'), create);
router.patch('/:id/dispense', requireRole('pharmacy'), dispense);
router.patch('/:id/reject', requireRole('pharmacy'), reject);

export default router;
