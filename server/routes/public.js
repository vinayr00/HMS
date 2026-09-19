import { Router } from 'express';
import { bookAppointment } from '../controllers/publicController.js';

const router = Router();

// POST /api/v1/public/appointments — unauthenticated public booking
router.post('/appointments', bookAppointment);

export default router;
