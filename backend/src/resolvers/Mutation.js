import uuidv4 from 'uuid/v4';

/* -------------------------------------------------------------------------- */
/*                                  UTILITIES                                 */
/* -------------------------------------------------------------------------- */

// const checkUser = async (db, name, info) => {
//   const existing = await db.UserModel.findOne({ name });
//   if (existing) return true;
//   return false;
// };

// const newUser = async (db, name) => {
//   new db.UserModel({ name }).save();
// };

const makeName = (name1, name2) => {
  return [name1, name2].sort().join('_');
};

const validateUser = async (db, name) => {
  const existing = await db.UserModel.findOne({ name });
  if (existing) return existing;
  console.log("User does not exist for CreateChatBox: " + name);
  return new db.UserModel({ name }).save();
};

const validateChatBox = async (db, name, participants=null) => {
  let box = await db.ChatBoxModel.findOne({ name });
  if (!box && participants) box = await new db.ChatBoxModel({ name, users: participants }).save();
  return box;
};

/* -------------------------------------------------------------------------- */
/*                                  MUTATION                                  */
/* -------------------------------------------------------------------------- */

const Mutation = {
  async createChatBox(parent, { name1, name2 }, { db }, info) {
    if (!name1 || !name2)
      throw new Error("Missing chatBox name for CreateChatBox");
    const chatBoxName = makeName(name1, name2);
    const user1 = await validateUser(db, name1);
    const user2 = await validateUser(db, name2);
    const chatBox = await validateChatBox(db, chatBoxName, [user1, user2]);
    return chatBox;
  },
  async createMessage(parent, { boxkey, name, body }, { db, pubsub }, info) {
    const chatBox = await validateChatBox(db, boxkey);
    if(!chatBox)
      throw new Error(`chatBox ${boxkey} not found`);
    const sender = await validateUser(db, name);
    
    const newMessage = new db.MessageModel({ sender, body });
    await newMessage.save();

    chatBox.messages.push(newMessage);
    await chatBox.save();

    pubsub.publish(`chatbox ${boxkey}`, {
      chatboxes: {
        message: newMessage,
      },
    });

    return newMessage;
  }
};

export { Mutation as default };
