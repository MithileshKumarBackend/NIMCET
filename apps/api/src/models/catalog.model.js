import mongoose from 'mongoose';
const base = { name: { type: String, required: true, trim: true, index: true }, description: String, slug: { type: String, required: true, lowercase: true, trim: true }, isActive: { type: Boolean, default: true }, deletedAt: { type: Date, default: null, index: true }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } };
const opts = { timestamps: true };
const examSchema = new mongoose.Schema(base, opts); examSchema.index({ slug: 1 }, { unique: true });
const subjectSchema = new mongoose.Schema({ ...base, exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true, index: true } }, opts); subjectSchema.index({ exam: 1, slug: 1 }, { unique: true });
const topicSchema = new mongoose.Schema({ ...base, subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true } }, opts); topicSchema.index({ subject: 1, slug: 1 }, { unique: true });
const subTopicSchema = new mongoose.Schema({ ...base, topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true, index: true } }, opts); subTopicSchema.index({ topic: 1, slug: 1 }, { unique: true });
export const Exam = mongoose.model('Exam', examSchema); export const Subject = mongoose.model('Subject', subjectSchema); export const Topic = mongoose.model('Topic', topicSchema); export const SubTopic = mongoose.model('SubTopic', subTopicSchema);
