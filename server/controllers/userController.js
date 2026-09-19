import User from '../models/User.js';
import { writeLog } from '../utils/auditLogger.js';

export const getAll = async (_req, res) => {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
};

export const getPublicDoctors = async (_req, res) => {
    const doctors = await User.find({ role: 'doctor', status: 'active' })
        .select('name employeeId department email')
        .sort({ name: 1 });
    res.json({ success: true, data: doctors, doctors });
};

export const create = async (req, res) => {
    const { name, employeeId, email, password, role, department } = req.body;
    if (!name || !employeeId || !email || !password || !role) {
        return res.status(400).json({ error: 'name, employeeId, email, password, and role are required' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ $or: [{ employeeId: employeeId.toUpperCase() }, { email: email.toLowerCase() }] });
    if (existing) {
        return res.status(409).json({ error: 'Employee ID or email already exists' });
    }

    // passwordHash field triggers the pre-save bcrypt hook
    const user = await User.create({ name, employeeId, email, passwordHash: password, role, department });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'CREATE_USER', entity: 'User', entityId: user._id.toString(),
    });

    res.status(201).json({ user });
};

export const update = async (req, res) => {
    const { password, ...updates } = req.body; // Don't allow password update via this route
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'UPDATE_USER', entity: 'User', entityId: user._id.toString(),
    });

    res.json({ user });
};

export const toggleStatus = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'TOGGLE_USER_STATUS', entity: 'User', entityId: user._id.toString(),
        status: user.status === 'suspended' ? 'Warning' : 'Success',
    });

    res.json({ user });
};

export const remove = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'DELETE_USER', entity: 'User', entityId: req.params.id,
    });

    res.json({ message: 'User deleted' });
};
