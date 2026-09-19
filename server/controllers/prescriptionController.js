import Prescription from '../models/Prescription.js';
import Medicine from '../models/Medicine.js';
import { writeLog } from '../utils/auditLogger.js';

export const getAll = async (req, res) => {
    const filter = {};
    if (req.user.role === 'doctor') filter.doctor = req.user.id;
    const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 });
    res.json({ prescriptions });
};

export const create = async (req, res) => {
    const { patient, patientName, appointment, items } = req.body;
    if (!patient || !items?.length) {
        return res.status(400).json({ error: 'patient and items are required' });
    }

    const prescription = await Prescription.create({
        patient, patientName,
        appointment: appointment || null,
        doctor: req.user.id,
        doctorName: req.user.name,
        items,
    });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'CREATE_PRESCRIPTION', entity: 'Prescription',
        entityId: prescription._id.toString(),
    });

    res.status(201).json({ prescription });
};

export const dispense = async (req, res) => {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    if (prescription.status !== 'pending') {
        return res.status(400).json({ error: `Prescription is already ${prescription.status}` });
    }

    // Check stock for all items first — atomic check
    for (const item of prescription.items) {
        const med = await Medicine.findById(item.medicine);
        if (!med) return res.status(400).json({ error: `Medicine not found: ${item.medicineName}` });
        if (med.stock < item.qty) {
            return res.status(400).json({
                error: `Insufficient stock for ${med.name}: need ${item.qty}, have ${med.stock}`,
            });
        }
    }

    // Deduct stock atomically for each medicine
    for (const item of prescription.items) {
        await Medicine.findByIdAndUpdate(item.medicine, { $inc: { stock: -item.qty } });
    }

    prescription.status = 'dispensed';
    prescription.dispensedBy = req.user.id;
    prescription.dispensedAt = new Date();
    await prescription.save();

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'DISPENSE_PRESCRIPTION', entity: 'Prescription',
        entityId: prescription._id.toString(),
    });

    res.json({ prescription });
};

export const reject = async (req, res) => {
    const { reason } = req.body;
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    if (prescription.status !== 'pending') {
        return res.status(400).json({ error: `Prescription is already ${prescription.status}` });
    }

    prescription.status = 'rejected';
    prescription.rejectedReason = reason || 'No reason provided';
    await prescription.save();

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'REJECT_PRESCRIPTION', entity: 'Prescription',
        entityId: prescription._id.toString(), status: 'Warning',
    });

    res.json({ prescription });
};
