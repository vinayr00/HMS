import { Router } from 'express';
import { getAll, getPublicDoctors, create, update, toggleStatus, remove } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

// Public doctor directory
router.get('/public/doctors', getPublicDoctors);

router.use(verifyToken, requireRole('admin'));

router.get('/', getAll);
router.post('/', create);
router.patch('/:id', update);
router.patch('/:id/toggle-status', toggleStatus);
router.delete('/:id', remove);

export default router;
