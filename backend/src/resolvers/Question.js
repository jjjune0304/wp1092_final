const Question = {
  id(parent, args, { db }) {
    return parent._id.toString();
  },
  createdAt(parent, args, { db }) {
    return parent.createdAt.toISOString();
  },
  updatedAt(parent, args, { db }) {
    return parent.updatedAt.toISOString();
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
  comments(parent, args, { db }) {
    if(!parent.comments) return [];
    return Promise.all(
      parent.comments.map((cId) =>
      db.CommentModel.findById(cId)),
    );
  },
};

export { Question as default };