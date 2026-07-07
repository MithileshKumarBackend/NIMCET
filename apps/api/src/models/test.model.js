import mongoose from 'mongoose';
const sectionSchema = new mongoose.Schema({ name: { type: String, required: true }, description: String, instructions: String, order: { type: Number, default: 0 }, isVisible: { type: Boolean, default: true }, durationMinutes: Number, positiveMarks: { type: Number, default: 4 }, negativeMarks: { type: Number, default: 0 }, unattemptedMarks: { type: Number, default: 0 }, questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] }, { _id: true, timestamps: true });
const testSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true, index: true }, subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true }, title: { type: String, required: true, trim: true, index: true }, description: String, instructions: String,
  sections: [sectionSchema], durationMinutes: Number, startTime: Date, endTime: Date,
  settings: { sectionWiseTimer: { type: Boolean, default: false }, shuffleQuestions: { type: Boolean, default: false }, shuffleOptions: { type: Boolean, default: false }, fullscreenMode: { type: Boolean, default: false }, autoSave: { type: Boolean, default: true }, autoSubmit: { type: Boolean, default: true }, passwordProtected: { type: Boolean, default: true }, negativeMarking: { type: Boolean, default: false }, resultVisibility: { type: String, enum: ['hidden','immediate','scheduled'], default: 'hidden' }, analysisVisibility: { type: Boolean, default: false }, reviewDurationMinutes: Number },
  access: { passwordHash: String, allowedEmails: [{ type: String, lowercase: true, trim: true, index: true }], maxAttemptsPerEmail: { type: Number, default: 1 } },
  status: { type: String, enum: ['draft','published','archived'], default: 'draft', index: true }, deletedAt: { type: Date, default: null, index: true }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
testSchema.virtual('totalQuestions').get(function () { return this.sections?.reduce((n, s) => n + (s.questions?.length || 0), 0) || 0; });
testSchema.index({ title: 'text', description: 'text' });
export const Test = mongoose.model('Test', testSchema);
