import { Router } from 'express';
import { getAll, getOne, create } from '../controllers/patientController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

// Public — patient self-registration
router.post('/', create);

// Protected
router.get('/', verifyToken, requireRole('doctor', 'receptionist', 'admin'), getAll);
router.get('/:id', verifyToken, requireRole('doctor', 'receptionist', 'admin'), getOne);

export default router;
