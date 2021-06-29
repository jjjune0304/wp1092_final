import isAuthenticated from '../authentication';

const Subscription = {
  inbox: {
    subscribe: isAuthenticated(async (parent, args, { db, pubsub, user }, info) => {
      return pubsub.asyncIterator(`user ${user._id}`);
    }),
  },
  feedback: {
    subscribe: isAuthenticated(async (parent, args, { db, pubsub, user }, info) => {
      return pubsub.asyncIterator(`userfeedback ${user._id}`);
    }),
  }
};

export { Subscription as default };
