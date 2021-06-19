const Comment = {
  id(parent, args, { db }) {
    return parent._id.toString();
  },
};

export { Comment as default };
