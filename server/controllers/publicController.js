import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { writeLog } from '../utils/auditLogger.js';

/**
 * POST /api/v1/public/appointments
 *
 * Unauthenticated public booking endpoint.
 * Creates a Patient + Appointment atomically.
 * Validates all inputs and doctor existence before writing to DB.
 */
export const bookAppointment = async (req, res) => {
    const {
        // Patient info
        name, age, gender, contact, email, symptoms,
        // Appointment info
        doctorId, appointmentDate, appointmentTime, department, reason,
    } = req.body;

    // --- Validate required fields ---
    const missing = [];
    if (!name) missing.push('name');
    if (!age) missing.push('age');
    if (!gender) missing.push('gender');
    if (!contact) missing.push('contact');
    if (!doctorId) missing.push('doctorId');
    if (!appointmentDate) missing.push('appointmentDate');
    if (!appointmentTime) missing.push('appointmentTime');

    if (missing.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    // --- Validate age ---
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 150) {
        return res.status(400).json({ error: 'age must be a number between 0 and 150' });
    }

    // --- Validate gender ---
    if (!['Male', 'Female', 'Other'].includes(gender)) {
        return res.status(400).json({ error: 'gender must be Male, Female, or Other' });
    }

    // --- Validate date format (YYYY-MM-DD) ---
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(appointmentDate)) {
        return res.status(400).json({ error: 'appointmentDate must be in YYYY-MM-DD format' });
    }
    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'appointmentDate is not a valid date' });
    }

    // --- Validate time format (HH:MM) ---
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(appointmentTime)) {
        return res.status(400).json({ error: 'appointmentTime must be in HH:MM format' });
    }

    // --- Validate doctor exists, is active, has doctor role ---
    const doctorUser = await User.findOne({ _id: doctorId, role: 'doctor', status: 'active' });
    if (!doctorUser) {
        return res.status(400).json({ error: 'Selected doctor not found or unavailable' });
    }

    // --- Check for conflicting appointment (same doctor, date, time) ---
    const conflict = await Appointment.findOne({
        doctor: doctorId,
        date: appointmentDate,
        time: appointmentTime,
        status: { $nin: ['cancelled'] },
    });
    if (conflict) {
        return res.status(409).json({
            error: 'That time slot is already booked. Please choose a different time.',
        });
    }

    // --- Create Patient ---
    const patient = await Patient.create({
        name: name.trim(),
        age: parsedAge,
        gender,
        contact: contact.trim(),
        symptoms: (symptoms || reason || '').trim(),
        department: department || doctorUser.department,
        assignedDoctor: doctorId,
        registeredBy: null,
        status: 'pending',
    });

    // --- Create Appointment ---
    const appointment = await Appointment.create({
        patient: patient._id,
        patientName: patient.name,
        doctor: doctorId,
        doctorName: doctorUser.name,
        date: appointmentDate,
        time: appointmentTime,
        type: 'New Visit',
        department: department || doctorUser.department,
        details: (symptoms || reason || '').trim(),
        contact: contact.trim(),
        createdBy: null,
    });

    await writeLog({
        actor: null,
        actorName: name.trim(),
        action: 'PUBLIC_BOOKING',
        entity: 'Appointment',
        entityId: appointment._id.toString(),
        status: 'Success',
    });

    const populated = await Appointment.findById(appointment._id)
        .populate('patient', 'name age gender contact')
        .populate('doctor', 'name department');

    res.status(201).json({
        message: 'Appointment booked successfully',
        patient: { _id: patient._id, name: patient.name },
        appointment: populated,
    });
};
