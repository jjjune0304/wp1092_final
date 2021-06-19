import isAuthenticated from '../authentication';

const Subscription = {
  comment: {
    subscribe: isAuthenticated(async (parent, { commentID }, { db, pubsub, user }, info) => {
      return
    }),
  }
};

export { Subscription as default };
