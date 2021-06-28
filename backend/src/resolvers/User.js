const User = {
  id(parent, args, { db }) {
    return parent._id.toString();
  },
  createdAt(parent, args, { db }) {
    return parent.createdAt.toISOString();
  },
  updatedAt(parent, args, { db }) {
    return parent.updatedAt.toISOString();
  },
  questions(parent, args, { db }) {
    if(!parent.questions) return [];
    return Promise.all(
      parent.questions.map((qId) =>
      db.QuestionModel.findById(qId)),
    );
  },
  answers(parent, args, { db }) {
    if(!parent.answers) return [];
    return Promise.all(
      parent.answers.map((aId) =>
      db.AnswerModel.findById(aId)),
    );
  },
};

export { User as default };
