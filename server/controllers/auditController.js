import AuditLog from '../models/AuditLog.js';

export const getLogs = async (req, res) => {
    const { page = 1, limit = 50, status, action } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (action) filter.action = new RegExp(action, 'i');

    const logs = await AuditLog.find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await AuditLog.countDocuments(filter);

    res.json({ logs, total, page: Number(page), limit: Number(limit) });
};
