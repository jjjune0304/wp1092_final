import isAuthenticated from '../authentication';

const Query = {
  me: isAuthenticated( async (parent, args , { db, user }, info) => {
    return user;
  }),

  user: async (parent, { email } , { db }, info) => {
    const user = await db.UserModel.findOne({ email });
    if(!user) throw new Error(`Email account ${email} is not registered.`)
    return user;
  },

  latest: async (parent, { num }, { db }, info) => {
    const questions = await db.QuestionModel.find().sort({ createdAt: -1 }).limit(num);
    if(!questions)
      throw new Error("Sorry. Nobody asks a question so far.");
    return questions;
  },

  hottest: async (parent, { num }, { db }, info) => {
    const questions = await db.QuestionModel.find().sort({ views: -1 }).limit(num);
    if(!questions)
      throw new Error("Sorry. Nobody asks a question so far.");
    return questions;
  },

  question: async (parent, { questionID }, { db }, info) => {
    const question = await db.QuestionModel.findById(questionID);
    if(!question)
      throw new Error(`Cannot find Question ID ${questionID}.`);
    question.views = question.views + 1;
    await question.save()
    return question;
  },

  search: async (parent, { keyword }, { db }, info) => {
    const regex = new RegExp(keyword, 'i') // i for case insensitive
    const questions = await db.QuestionModel.find({ 
        title: { $regex: regex }}).sort({ views: -1 });
    if(!questions) return [];
    return questions;
  },

};

export { Query as default };
