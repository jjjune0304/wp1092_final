import ChatBox from "./ChatBox";

const Query = {
  async chatboxes(parent, { boxkey }, { db }, info) {
    const box = await db.ChatBoxModel.findOne({ name: boxkey });
    if(!box)
      throw new Error(`ChatBox ${boxkey} does not exist.`);
    return box;
    // return { 
    //   id: box._id,
    //   name: box.name, 
    //   messages: box.messages };
  },
};

export { Query as default };
