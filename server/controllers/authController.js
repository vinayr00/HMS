import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { writeLog } from '../utils/auditLogger.js';

export const login = async (req, res) => {
    const { employeeId, password, role } = req.body;

    if (!employeeId || !password || !role) {
        return res.status(400).json({ error: 'employeeId, password, and role are required' });
    }

    const normalizedRole = role.toLowerCase();

    // Find user with matching employeeId AND role (case-insensitive)
    const user = await User.findOne({
        employeeId: employeeId.toUpperCase(),
        role: normalizedRole,
        status: 'active',
    });

    if (!user) {
        await writeLog({ actorName: employeeId, action: 'LOGIN_ATTEMPT', entity: 'System', status: 'Failed' });
        return res.status(401).json({ error: 'Invalid ID, role, or account suspended' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
        await writeLog({ actor: user._id, actorName: user.name, action: 'LOGIN_ATTEMPT', entity: 'System', status: 'Failed' });
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name, employeeId: user.employeeId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    await writeLog({ actor: user._id, actorName: user.name, action: 'LOGIN', entity: 'System', status: 'Success' });

    res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role,
            employeeId: user.employeeId,
            department: user.department,
            email: user.email,
        },
    });
};

export const me = async (req, res) => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user || user.status !== 'active') {
        return res.status(401).json({ error: 'Account not found or suspended' });
    }
    res.json({ user });
};
