const Comment = {
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
};

export { Comment as default };
