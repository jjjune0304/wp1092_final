const User = {
  id(parent, args, { db }) {
    return parent._id.toString();
  }
};

export { User as default };
