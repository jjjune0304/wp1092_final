/* -------------------------------------------------------------------------- */
/*                               MONGOOSE MODELS                              */
/* -------------------------------------------------------------------------- */
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const schemaOptions = {
  timestamps: true
};

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  points: {type: Number, required: true},
  questions: [{ type: mongoose.Types.ObjectId, ref: 'Question' }],
  answers: [{ type: mongoose.Types.ObjectId, ref: 'Answer' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
}, schemaOptions);

const questionSchema = new Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  body: { type: String, required: true },
  answers: [{ type: mongoose.Types.ObjectId, ref: 'Answer' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  subscribers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  views: {type: Number, required: true},
}, schemaOptions);

const answerSchema = new Schema({
  question: { type: mongoose.Types.ObjectId, ref: 'Question' },
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  body: { type: String, required: true },
  best: {type: Boolean, required: true},
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
}, schemaOptions);

const commentSchema = new Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Types.ObjectId, required: true },
  postType: { type: String, required: true }, // question, answer
  text: { type: String, required: true },
}, schemaOptions);

const UserModel = mongoose.model('User', userSchema);
const QuestionModel = mongoose.model('Question', questionSchema);
const AnswerModel = mongoose.model('Answer', answerSchema);
const CommentModel = mongoose.model('Comment', commentSchema);

const db = {
  UserModel,
  QuestionModel,
  AnswerModel,
  CommentModel
};

export { db as default };
