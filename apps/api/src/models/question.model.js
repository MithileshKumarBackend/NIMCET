import mongoose from 'mongoose';
const imageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false });
const localizedTextSchema = new mongoose.Schema({ language: { type: String, default: 'en' }, content: { type: String, required: true } }, { _id: false });
const optionSchema = new mongoose.Schema({ key: { type: String, required: true }, text: String, richText: String, image: imageSchema, isCorrect: { type: Boolean, default: false } }, { _id: true });
const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['single_correct_mcq','multiple_correct_mcq','true_false','integer','fill_blank','paragraph'], required: true, index: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', index: true }, subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', index: true }, topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', index: true }, subTopic: { type: mongoose.Schema.Types.ObjectId, ref: 'SubTopic', index: true },
  difficulty: { type: String, enum: ['easy','medium','hard'], default: 'medium', index: true }, language: { type: String, default: 'en', index: true },
  prompt: { type: String, required: true }, localizedPrompts: [localizedTextSchema], paragraph: String, questionImage: imageSchema,
  options: [optionSchema], integerAnswer: Number, textAnswers: [String], explanation: String, explanationImage: imageSchema, solution: String, hints: [String], tags: [{ type: String, index: true }],
  status: { type: String, enum: ['draft','published','archived'], default: 'draft', index: true }, deletedAt: { type: Date, default: null, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, clonedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
}, { timestamps: true });
questionSchema.index({ prompt: 'text', tags: 'text', explanation: 'text' });
questionSchema.index({ exam: 1, subject: 1, topic: 1, subTopic: 1, difficulty: 1, language: 1 });
export const Question = mongoose.model('Question', questionSchema);
