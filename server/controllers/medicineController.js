import Medicine from '../models/Medicine.js';
import { writeLog } from '../utils/auditLogger.js';

export const getAll = async (_req, res) => {
    const medicines = await Medicine.find().sort({ name: 1 });
    res.json({ medicines });
};

export const create = async (req, res) => {
    const { name, category, stock, reorderLevel, expiry, price } = req.body;
    if (!name || !category || !expiry || price === undefined) {
        return res.status(400).json({ error: 'name, category, expiry, and price are required' });
    }

    const medicine = await Medicine.create({ name, category, stock: stock || 0, reorderLevel: reorderLevel || 50, expiry, price });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'ADD_MEDICINE', entity: 'Medicine', entityId: medicine._id.toString(),
    });

    res.status(201).json({ medicine });
};

export const update = async (req, res) => {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'UPDATE_MEDICINE', entity: 'Medicine', entityId: medicine._id.toString(),
    });

    res.json({ medicine });
};

export const remove = async (req, res) => {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'REMOVE_MEDICINE', entity: 'Medicine', entityId: req.params.id,
    });

    res.json({ message: 'Medicine removed' });
};
