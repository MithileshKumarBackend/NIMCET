import mongoose from 'mongoose';
const auditLogSchema = new mongoose.Schema({ actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, action: { type: String, required: true, index: true }, entity: { type: String, index: true }, entityId: mongoose.Schema.Types.ObjectId, ip: String, userAgent: String, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true });
auditLogSchema.index({ createdAt: -1 });
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
