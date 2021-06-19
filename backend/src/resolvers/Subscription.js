const Subscription = {
  // chatboxes: {
  //   async subscribe(parent, { boxkey }, { db, pubsub }, info) {
  //     const chatbox = await db.ChatBoxModel.findOne({ name: boxkey });

  //     if(!chatbox)
  //       throw new Error(`chatBox ${boxkey} not found`);

  //     return pubsub.asyncIterator(`chatbox ${boxkey}`);
  //   },
  // }
};

export { Subscription as default };
