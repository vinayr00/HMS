import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/medicineController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

router.use(verifyToken);

router.get('/', requireRole('pharmacy', 'doctor', 'admin'), getAll);
router.post('/', requireRole('pharmacy', 'admin'), create);
router.patch('/:id', requireRole('pharmacy', 'admin'), update);
router.delete('/:id', requireRole('pharmacy', 'admin'), remove);

export default router;
