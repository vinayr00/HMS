import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }

    // Re-check database on every request — prevents deleted/suspended users
    // from continuing to use an otherwise valid JWT
    const user = await User.findById(decoded.id).select('status role name employeeId');
    if (!user || user.status !== 'active') {
        return res.status(401).json({ error: 'Account not found or suspended' });
    }

    req.user = {
        id: user._id.toString(),
        role: user.role,
        name: user.name,
        employeeId: user.employeeId,
    };

    next();
};
