const User = {
  id(parent, args, { db }, info) {
    return parent._id.toString();
  }
};

export { User as default };
