import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
        patientName: { type: String, required: true }, // denormalized for display
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        doctorName: { type: String, required: true }, // denormalized for display
        date: { type: String, required: true }, // ISO date string YYYY-MM-DD
        time: { type: String, required: true },
        type: { type: String, enum: ['New Visit', 'Follow-up', 'Emergency'], default: 'New Visit' },
        status: {
            type: String,
            enum: ['scheduled', 'checked-in', 'in-consultation', 'completed', 'cancelled'],
            default: 'scheduled',
        },
        department: { type: String, trim: true },
        details: { type: String, trim: true },
        contact: { type: String, trim: true },
        notes: { type: String, default: '' },
        completedAt: { type: Date, default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
    { timestamps: true }
);

appointmentSchema.index({ date: 1, status: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });

export default mongoose.model('Appointment', appointmentSchema);
