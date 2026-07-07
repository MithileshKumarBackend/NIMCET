import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, title: { type: String, required: true }, message: String, type: { type: String, default: 'info' }, readAt: Date, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true });
export const Notification = mongoose.model('Notification', notificationSchema);
