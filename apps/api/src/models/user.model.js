import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLE_VALUES, ROLES } from '../constants/roles.js';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, select: false },
  role: { type: String, enum: ROLE_VALUES, default: ROLES.STUDENT, index: true },
  avatar: { url: String, publicId: String },
  provider: { type: String, enum: ['email', 'google'], default: 'email' },
  googleId: { type: String, sparse: true, index: true },
  isEmailVerified: { type: Boolean, default: false, index: true },
  isActive: { type: Boolean, default: true, index: true },
  tokenVersion: { type: Number, default: 0, select: false },
  deletedAt: { type: Date, default: null, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, toJSON: { virtuals: true } });
userSchema.index({ name: 'text', email: 'text' });
userSchema.virtual('displayName').get(function () { return this.name; });
userSchema.methods.setPassword = async function (password) { this.passwordHash = await bcrypt.hash(password, 12); };
userSchema.methods.comparePassword = function (password) { return bcrypt.compare(password, this.passwordHash || ''); };
export const User = mongoose.model('User', userSchema);
