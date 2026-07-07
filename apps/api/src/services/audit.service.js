import { AuditLog } from '../models/auditLog.model.js';
export async function audit({ req, actor, action, entity, entityId, metadata }) { await AuditLog.create({ actor, action, entity, entityId, metadata, ip: req?.ip, userAgent: req?.get?.('user-agent') }); }
