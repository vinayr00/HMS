import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
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
    const {
        // Patient creation fields (when creating new patient from reception)
        patientData,
        // OR existing patient ID
        patientId,
        // Appointment fields
        doctor: doctorId, doctorName,
        date, time, type, department, details, contact,
    } = req.body;

    if (!doctorId || !date || !time) {
        return res.status(400).json({ error: 'doctor, date, and time are required' });
    }

    if (!patientId && !patientData) {
        return res.status(400).json({ error: 'Either patientId or patientData is required' });
    }

    // Validate doctor exists and is active with doctor role
    const doctorUser = await User.findOne({ _id: doctorId, role: 'doctor', status: 'active' });
    if (!doctorUser) {
        return res.status(400).json({ error: 'Invalid or inactive doctor ID' });
    }

    // Resolve patient
    let patient;
    if (patientId) {
        patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
    } else {
        const { name, age, gender, contact: pContact, symptoms } = patientData;
        if (!name || !age || !gender || !pContact) {
            return res.status(400).json({ error: 'patientData must include name, age, gender, contact' });
        }
        patient = await Patient.create({
            name, age, gender,
            contact: pContact,
            symptoms: symptoms || '',
            department: department || '',
            assignedDoctor: doctorId,
            registeredBy: req.user.id,
            status: 'registered',
        });
    }

    const appointment = await Appointment.create({
        patient: patient._id,
        patientName: patient.name,
        doctor: doctorId,
        doctorName: doctorName || doctorUser.name,
        date, time,
        type: type || 'New Visit',
        department: department || doctorUser.department,
        details: details || '',
        contact: contact || patient.contact,
        createdBy: req.user.id,
    });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'CREATE_APPOINTMENT', entity: 'Appointment',
        entityId: appointment._id.toString(),
    });

    const populated = await Appointment.findById(appointment._id)
        .populate('patient', 'name age gender contact')
        .populate('doctor', 'name department');

    res.status(201).json({ appointment: populated });
};

export const updateStatus = async (req, res) => {
    const { status, notes } = req.body;
    const allowed = ['scheduled', 'checked-in', 'in-consultation', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
    }

    // Fetch first to enforce ownership
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    // Authorization: admin can update any, receptionist can update any,
    // doctor can only update their own appointment (BOLA fix)
    const isAdmin = req.user.role === 'admin';
    const isReceptionist = req.user.role === 'receptionist';
    const isOwningDoctor =
        req.user.role === 'doctor' &&
        appointment.doctor.toString() === req.user.id;

    if (!isAdmin && !isReceptionist && !isOwningDoctor) {
        return res.status(403).json({ error: 'Forbidden: you do not own this appointment' });
    }

    const update = { status };
    if (notes !== undefined) update.notes = notes;
    if (status === 'completed') update.completedAt = new Date();

    const updated = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true })
        .populate('patient', 'name age gender contact')
        .populate('doctor', 'name department');

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: `APPOINTMENT_${status.toUpperCase()}`, entity: 'Appointment',
        entityId: updated._id.toString(),
    });

    res.json({ appointment: updated });
};
