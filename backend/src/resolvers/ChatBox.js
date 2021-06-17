const ChatBox = {
  id(parent, args, { db }, info) {
    return parent._id.toString();
  },
  messages(parent, args, { db }, info) {
    if(!parent.messages) return [];
    return Promise.all(
      parent.messages.map((mId) =>
      db.MessageModel.findById(mId)),
    );
  }
};

export default ChatBox;