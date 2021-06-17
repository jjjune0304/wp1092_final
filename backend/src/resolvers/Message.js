const Message = {
  id(parent, args, { db }, info) {
    return parent._id.toString();
  },
  sender(parent, args, { db }, info) { 
    return db.UserModel.findById(parent.sender);
  }
};

export default Message;