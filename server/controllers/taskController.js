import Task from '../models/Task.js';
import { writeLog } from '../utils/auditLogger.js';

export const getMine = async (req, res) => {
    const tasks = await Task.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
    res.json({ tasks });
};

export const updateStatus = async (req, res) => {
    const { status } = req.body;
    const allowed = ['PENDING', 'ACTIVE', 'PAUSED', 'COMPLETED'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
    }

    const update = { status };
    if (status === 'COMPLETED') update.completedAt = new Date();

    // If starting a task, pause any other active task for this user
    if (status === 'ACTIVE') {
        await Task.updateMany(
            { assignedTo: req.user.id, status: 'ACTIVE', _id: { $ne: req.params.id } },
            { status: 'PAUSED' }
        );
    }

    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, assignedTo: req.user.id }, // ownership check
        update,
        { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found or not yours' });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: `TASK_${status}`, entity: 'Task', entityId: task._id.toString(),
    });

    res.json({ task });
};
