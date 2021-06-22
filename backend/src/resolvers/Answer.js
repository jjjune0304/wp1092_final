const Answer = {
  id(parent, args, { db }) {
    return parent._id.toString();
  },
  async author(parent, args, { db }) {
    return await db.UserModel.findById(parent.author);
  },
  async question(parent, args, { db }) {
    return await db.QuestionModel.findById(parent.question);
  },
};

export { Answer as default };