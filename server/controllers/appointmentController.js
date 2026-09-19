import Appointment from '../models/Appointment.js';
import { writeLog } from '../utils/auditLogger.js';

export const getAll = async (req, res) => {
    const filter = {};
    // Doctors only see their own appointments
    if (req.user.role === 'doctor') {
        filter.doctor = req.user.id;
    }
    const appointments = await Appointment.find(filter)
        .sort({ date: 1, time: 1 })
        .populate('patient', 'name age gender contact')
        .populate('doctor', 'name department');
    res.json({ appointments });
};

export const create = async (req, res) => {
    const { patient, patientName, doctor, doctorName, date, time, type, department, details, contact } = req.body;
    if (!patient || !doctor || !date || !time) {
        return res.status(400).json({ error: 'patient, doctor, date, and time are required' });
    }

    const appointment = await Appointment.create({
        patient, patientName, doctor, doctorName, date, time, type, department, details, contact,
        createdBy: req.user.id,
    });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'CREATE_APPOINTMENT', entity: 'Appointment',
        entityId: appointment._id.toString(),
    });

    res.status(201).json({ appointment });
};

export const updateStatus = async (req, res) => {
    const { status, notes } = req.body;
    const allowed = ['scheduled', 'checked-in', 'in-consultation', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
    }

    const update = { status };
    if (notes !== undefined) update.notes = notes;
    if (status === 'completed') update.completedAt = new Date();

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: `APPOINTMENT_${status.toUpperCase()}`, entity: 'Appointment',
        entityId: appointment._id.toString(),
    });

    res.json({ appointment });
};
