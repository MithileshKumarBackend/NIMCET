import mongoose from 'mongoose';
const refreshTokenSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, jti: { type: String, required: true, unique: true }, tokenHash: { type: String, required: true }, family: { type: String, required: true, index: true }, userAgent: String, ip: String, expiresAt: { type: Date, required: true, index: { expires: 0 } }, revokedAt: Date, replacedBy: String }, { timestamps: true });
export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
const purposeValues = ['email_verification', 'password_reset'];
const verificationTokenSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, tokenHash: { type: String, required: true, unique: true }, purpose: { type: String, enum: purposeValues, required: true, index: true }, expiresAt: { type: Date, required: true, index: { expires: 0 } }, usedAt: Date }, { timestamps: true });
export const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);
