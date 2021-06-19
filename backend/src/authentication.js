import { ForbiddenError } from 'apollo-server';

const isAuthenticated = resolverFunc => async (parent, args, context) => {
  if (!context.user) throw new ForbiddenError('Please log in first.');
  const user = await context.db.UserModel.findById(context.user.id)
  if(!user) throw new Error(`Email account ${context.user.email} not found`);
  return resolverFunc.apply(null, [parent, args, { ...context, user}]);
};

export { isAuthenticated as default };