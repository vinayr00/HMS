import { Router } from 'express';
import { getLogs } from '../controllers/auditController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

router.get('/', verifyToken, requireRole('admin'), getLogs);

export default router;
