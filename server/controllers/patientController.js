import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import { writeLog } from '../utils/auditLogger.js';

export const getAll = async (req, res) => {
    // Doctors only see patients connected to their own appointments (Step 6 — data minimization)
    if (req.user.role === 'doctor') {
        const appointments = await Appointment.find({ doctor: req.user.id }).select('patient');
        const patientIds = [...new Set(appointments.map(a => a.patient.toString()))];
        const patients = await Patient.find({ _id: { $in: patientIds } })
            .sort({ createdAt: -1 })
            .populate('assignedDoctor', 'name');
        return res.json({ patients });
    }

    // Receptionist / admin see all patients
    const patients = await Patient.find().sort({ createdAt: -1 }).populate('assignedDoctor', 'name');
    res.json({ patients });
};

export const getOne = async (req, res) => {
    const patient = await Patient.findById(req.params.id).populate('assignedDoctor', 'name');
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    // Doctor can only access patients connected to their appointments
    if (req.user.role === 'doctor') {
        const linked = await Appointment.findOne({ doctor: req.user.id, patient: req.params.id });
        if (!linked) return res.status(403).json({ error: 'Forbidden: not your patient' });
    }

    res.json({ patient });
};

export const create = async (req, res) => {
    const { name, age, gender, contact, symptoms, department, doctor } = req.body;
    if (!name || !age || !gender || !contact) {
        return res.status(400).json({ error: 'name, age, gender, and contact are required' });
    }

    const patient = await Patient.create({
        name, age, gender, contact, symptoms, department, doctor,
        registeredBy: req.user?.id || null,
        status: 'pending',
    });

    await writeLog({
        actor: req.user?.id || null,
        actorName: req.user?.name || 'Public',
        action: 'CREATE_PATIENT',
        entity: 'Patient',
        entityId: patient._id.toString(),
    });

    res.status(201).json({ patient });
};
