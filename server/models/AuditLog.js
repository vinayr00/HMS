import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        actorName: { type: String, required: true },
        action: { type: String, required: true },
        entity: { type: String, required: true },
        entityId: { type: String, default: null },
        status: {
            type: String,
            enum: ['Success', 'Failed', 'Warning'],
            default: 'Success',
        },
        timestamp: { type: Date, default: Date.now, index: true },
    },
    {
        // No update/delete allowed — append-only
        // Enforced by having no update controllers for this model
    }
);

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ actor: 1 });

export default mongoose.model('AuditLog', auditLogSchema);
