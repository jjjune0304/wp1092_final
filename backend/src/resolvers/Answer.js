const Answer = {
  id(parent, args, { db }) {
    return parent._id.toString();
  },
};

export { Answer as default };