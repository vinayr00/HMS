import Patient from '../models/Patient.js';
import { writeLog } from '../utils/auditLogger.js';

export const getAll = async (req, res) => {
    const patients = await Patient.find().sort({ createdAt: -1 }).populate('assignedDoctor', 'name');
    res.json({ patients });
};

export const getOne = async (req, res) => {
    const patient = await Patient.findById(req.params.id).populate('assignedDoctor', 'name');
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
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
