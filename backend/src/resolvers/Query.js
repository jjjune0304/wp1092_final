
const Query = {
  async user(parent, { username }, { db }, info) {
    const user = await db.UserModel.findOne({ username });
    if(!user)
      throw new Error(`User ${username} does not exist.`);
    return user;
  },
};

export { Query as default };
