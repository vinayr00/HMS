import rateLimit from 'express-rate-limit';

/**
 * Login rate limiter — applied only to POST /api/v1/auth/login.
 * Allows 10 attempts per 15-minute window per IP.
 * Does NOT apply globally to avoid impacting normal authenticated users.
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
    skipSuccessfulRequests: false, // count all attempts (even successful) to prevent enumeration
});
