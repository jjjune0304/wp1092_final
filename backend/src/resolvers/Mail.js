const Mail = {
  id(parent, args, { db }) {
    return parent._id.toString();
  },
  createdAt(parent, args, { db }) {
    return parent.createdAt.toISOString();
  },
  updatedAt(parent, args, { db }) {
    return parent.updatedAt.toISOString();
  },
};

export { Mail as default };