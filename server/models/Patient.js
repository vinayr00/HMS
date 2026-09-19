import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        age: { type: Number, required: true, min: 0, max: 150 },
        gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
        contact: { type: String, required: true, trim: true },
        symptoms: { type: String, trim: true },
        department: { type: String, trim: true },
        doctor: { type: String, trim: true }, // doctor name from public form; linked to User after reception
        assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        status: {
            type: String,
            enum: ['pending', 'registered', 'discharged'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);
