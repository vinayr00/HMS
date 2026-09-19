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
    console.warn('⚠️ WARNING: JWT_SECRET environment variable is not set. Using default secret for development/healthcheck.');
    process.env.JWT_SECRET = 'hms_default_jwt_secret_please_set_in_render_dashboard';
}

const app = express();

// Security & parsing
app.use(helmet());

// CORS configuration — allowlist with Vercel and local dev support
const rawOrigins = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_ORIGIN,
    'https://hms-client-steel.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

const allowedOrigins = rawOrigins
    .flatMap(o => (o ? o.split(',').map(s => s.trim().replace(/\/+$/, '')) : []))
    .filter(Boolean);

const isOriginAllowed = (origin) => {
    if (!origin) return true; // Server-to-server, curl, health probes
    const normalized = origin.trim().replace(/\/+$/, '');
    if (allowedOrigins.includes('*') || allowedOrigins.includes(normalized)) {
        return true;
    }
    // Allow any Vercel domain (e.g. https://hms-client-steel.vercel.app or branch previews)
    if (/^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(normalized)) {
        return true;
    }
    // Allow localhost/127.0.0.1 on any port
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized)) {
        return true;
    }
    return false;
};

const corsOptions = {
    origin(origin, callback) {
        if (isOriginAllowed(origin)) {
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

// Health check — exact response requested for GET /api/v1/health + aliases
const healthHandler = (_req, res) => res.status(200).json({
    status: 'ok',
    message: 'HMS API is running'
});

app.get('/api/v1/health', healthHandler);
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);
app.get('/', healthHandler);

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

// Listen immediately on 0.0.0.0 so Render's healthCheckPath gets 200 without delay
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 HMS Server running on port ${PORT} (bound to 0.0.0.0)`);
});

// Connect to database in background
connectDB();
