const Question = {
  id(parent, args, { db }) {
    return parent._id.toString();
  },
  async author(parent, args, { db }) {
    return await db.UserModel.findById(parent.author);
  },
  answers(parent, args, { db }) {
    if(!parent.answers) return [];
    return Promise.all(
      parent.answers.map((aId) =>
      db.AnswerModel.findById(aId)),
    );
  },
};

export { Question as default };