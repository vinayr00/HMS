import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import appointmentRoutes from './routes/appointments.js';
import prescriptionRoutes from './routes/prescriptions.js';
import medicineRoutes from './routes/medicines.js';
import invoiceRoutes from './routes/invoices.js';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';
import auditRoutes from './routes/audit.js';

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/medicines', medicineRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/audit', auditRoutes);

// Global error handler — never leaks stack traces in production
app.use((err, _req, res, _next) => {
    console.error(err);
    const status = err.status || 500;
    const message =
        process.env.NODE_ENV === 'production' && status === 500
            ? 'Internal server error'
            : err.message || 'Internal server error';
    res.status(status).json({ error: message });
});

// 404 for unknown routes
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 HMS Server running on port ${PORT}`));
});
