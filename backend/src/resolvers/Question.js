const Question = {
  id(parent, args, { db }) {
    return parent._id.toString();
  }
};

export { Question as default };