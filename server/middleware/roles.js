/**
 * Role guard factory — use after verifyToken middleware.
 * Example: router.get('/users', verifyToken, requireRole('admin'), handler)
 */
export const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());
    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
            error: `Forbidden: requires role [${roles.join(', ')}]`,
        });
    }
    next();
};
