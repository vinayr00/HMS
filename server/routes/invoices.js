import { Router } from 'express';
import { getAll, create, markPaid, refund } from '../controllers/invoiceController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

router.use(verifyToken);

router.get('/', requireRole('receptionist', 'admin'), getAll);
router.post('/', requireRole('receptionist'), create);
router.patch('/:id/pay', requireRole('receptionist'), markPaid);
router.patch('/:id/refund', requireRole('admin'), refund);

export default router;
