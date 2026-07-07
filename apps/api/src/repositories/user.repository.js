import { User } from '../models/user.model.js';

export const userRepository = {
  create: (data) => User.create(data),
  findByEmailWithPassword: (email) => User.findOne({ email: email.toLowerCase(), deletedAt: null }).select('+passwordHash +tokenVersion'),
  findByEmail: (email) => User.findOne({ email: email.toLowerCase(), deletedAt: null }).select('+tokenVersion'),
  findById: (id) => User.findOne({ _id: id, deletedAt: null }).select('+tokenVersion'),
  updateById: (id, data) => User.findByIdAndUpdate(id, data, { new: true }),
  incrementTokenVersion: (id) => User.findByIdAndUpdate(id, { $inc: { tokenVersion: 1 } }, { new: true }),
};
