import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 定義 bcrypt 加密所需 saltRounds 次數
const SALT_ROUNDS = 2;
// 定義 jwt 所需 secret (隨意)
const SECRET = 'epistemologyet';

/* -------------------------------------------------------------------------- */
/*                                  UTILITIES                                 */
/* -------------------------------------------------------------------------- */
const hash = text => bcrypt.hash(text, SALT_ROUNDS);

const addUser = async ({ db, username, email, password }) => {
  const points = 100;
  return new db.UserModel({ username, email, password, points }).save();
};

const createToken = ({ _id, email, username }) => { 
  const id = _id.toString();
  return jwt.sign({ id, email, username }, SECRET, { expiresIn: '1d' });
};

/* -------------------------------------------------------------------------- */
/*                                  MUTATION                                  */
/* -------------------------------------------------------------------------- */

const Mutation = {
  async signup(parent, { username, password, email }, { db }, info) {
    if (!username || !password || !email)
      throw new Error("Missing some information for sign up");
    const existing = await db.UserModel.findOne({ email });
    if (existing) {
      console.log(`Email account ${email} has been registered.`);
      return existing;
    }
      // throw new Error(`Email account ${email} has been registered.`);
    // encrypt password
    const hashedPassword = await hash(password, SALT_ROUNDS);
    return await addUser({ db, username, email, password: hashedPassword });
  },

  async login(parent, { email, password }, { db }, info) {
    if (!password || !email)
      throw new Error("Missing some information for log in");
    
    const user = await db.UserModel.findOne({ email });
    if (!user)
      throw new Error(`Email account ${email} has not been registered.`);
    
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) 
      throw new Error('Wrong Password');
    
    return { token: await createToken(user) };
  },

  async logout(parent, args, { db }, info) {
   
  },

  async createQuestion(parent, { title, body, author }, { db, pubsub }, info) {
    const user = await db.UserModel.findById(author)
    if(!user)
      throw new Error(`UserID ${author} not found`);
    const newQuestion = new db.QuestionModel({ title, body, author, views: 0 });
    await newQuestion.save();

    user.questions.push(newQuestion);
    await user.save();

    const questionID = newQuestion._id.toString();
    pubsub.publish(`question ${questionID}`, {
      questions: {
        title, 
        author: user.username,
      },
    });
    return newQuestion;
  },
  async createAnswer(parent, { body, author, postID }, { db, pubsub }, info) {
  },
  async createComment(parent, { text, author, postID, postType }, { db, pubsub }, info) {
  },
};

export { Mutation as default };
