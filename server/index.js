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
import publicRoutes from './routes/public.js';

if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL: JWT_SECRET environment variable is missing.');
    process.exit(1);
}

const app = express();

// Security & parsing
app.use(helmet());

// CORS configuration — strict allowlist for production + local dev fallbacks
const rawOrigins = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_ORIGIN,
    process.env.NODE_ENV !== 'production' ? 'http://localhost:5173' : null,
    process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:5173' : null,
    process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : null,
];

const allowedOrigins = rawOrigins
    .flatMap(o => (o ? o.split(',').map(s => s.trim().replace(/\/+$/, '')) : []))
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        // Allow requests with no origin (e.g. server-to-server, curl, health check probes)
        if (!origin) {
            return callback(null, true);
        }
        const normalizedOrigin = origin.trim().replace(/\/+$/, '');
        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Health check — lightweight, safe, zero secrets exposed
app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok', service: 'hms-api' }));

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
app.use('/api/v1/public', publicRoutes);

// Global error handler — never leaks stack traces or credentials in production
app.use((err, _req, res, _next) => {
    if (process.env.NODE_ENV === 'production') {
        console.error(`[Error] ${err.name || 'Error'}: ${err.message}`);
    } else {
        console.error(err);
    }

    if (err.message && err.message.includes('CORS origin not allowed')) {
        return res.status(403).json({ error: 'CORS origin not allowed' });
    }

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
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 HMS Server running on port ${PORT} (bound to 0.0.0.0)`));
}).catch((err) => {
    console.error('❌ Failed to start server due to database connection error');
    process.exit(1);
});
