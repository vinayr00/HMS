import mongoose from 'mongoose';

const prescriptionItemSchema = new mongoose.Schema(
    {
        medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
        medicineName: { type: String, required: true }, // denormalized
        dosage: { type: String, required: true },
        freq: { type: String, required: true },
        duration: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
    {
        appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
        patientName: { type: String, required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        doctorName: { type: String, required: true },
        items: { type: [prescriptionItemSchema], required: true },
        status: {
            type: String,
            enum: ['pending', 'dispensed', 'rejected'],
            default: 'pending',
        },
        rejectedReason: { type: String, default: null },
        dispensedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        dispensedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ patient: 1 });

export default mongoose.model('Prescription', prescriptionSchema);
