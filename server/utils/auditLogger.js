import AuditLog from '../models/AuditLog.js';

/**
 * Write an audit log entry. Never throws — log failures must not break the request.
 */
export const writeLog = async ({ actor = null, actorName = 'System', action, entity, entityId = null, status = 'Success' }) => {
    try {
        await AuditLog.create({ actor, actorName, action, entity, entityId, status });
    } catch (err) {
        console.error('[AuditLogger] Failed to write log:', err.message);
    }
};
