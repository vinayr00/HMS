import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        type: {
            type: String,
            enum: ['Room Prep', 'Assistance', 'Admin', 'Maintenance', 'Other'],
            default: 'Other',
        },
        priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
        status: {
            type: String,
            enum: ['PENDING', 'ACTIVE', 'PAUSED', 'COMPLETED'],
            default: 'PENDING',
        },
        details: { type: String, trim: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        completedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

taskSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model('Task', taskSchema);
