import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isAuthenticated from '../authentication';

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
  signup: async (parent, { username, password, email }, { db }, info) => {
    if (!username || !password || !email)
      throw new Error("Missing some information for sign up");
    const existing = await db.UserModel.findOne({ email });
    if (existing) throw new Error(`Email account ${email} has been registered.`);

    // encrypt password
    const hashedPassword = await hash(password, SALT_ROUNDS);
    return await addUser({ db, username, email, password: hashedPassword });
  },

  login: async (parent, { email, password }, { db }, info) => {
    if (!password || !email)
      throw new Error("Missing some information for log in");
    
    const user = await db.UserModel.findOne({ email });
    if (!user)
      throw new Error(`Please sign up for email account ${email}`);
    
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) 
      throw new Error('Wrong Password');
    
    return { token: await createToken(user) };
  },

  logout: async (parent, args, { db }, info) => {
    return true;
  },

  createQuestion: isAuthenticated(async (parent, { title, body, reward }, { db, pubsub, user }) => {
    if (!title || !body || !reward)
      throw new Error("Missing some information for a valid question");
    const author = user;
    const newQuestion = new db.QuestionModel({ 
      title, body, author, reward,
      views: 0,
      subscribers: [author] 
    });
    await newQuestion.save();

    author.questions.push(newQuestion);
    await author.save();

    pubsub.publish(`user ${author._id}`, {
      inbox: {
        type: 'ASK', 
        message: `You just asked a question: ${newQuestion.title}`,
        time: newQuestion.createAt,
        refID: newQuestion._id,
      },
    });
    return newQuestion;
  }),

  createAnswer: isAuthenticated(async (parent, { body, postID }, { db, pubsub, user }) => {
    if (!postID || !body)
      throw new Error("Missing some information for a valid answer");
    const author = user;
    const question = await db.QuestionModel.findById(postID);
    if(!question) throw new Error(`QuestionID ${postID} not found`);

    const newAnswer = new db.AnswerModel({ question, author, body, best: false, like: 0 });
    await newAnswer.save();
    
    author.answers.push(newAnswer);
    await author.save();

    question.answers.push(newAnswer);
    if(question.subscribers.findIndex(sub => author._id.equals(sub._id)) === -1) {
      question.subscribers.push(author);
      console.log(`Add ${author.email} to subscriber list`);
    }
    await question.save();
    
    // author
    pubsub.publish(`user ${author._id}`, {
      inbox: {
        type: 'ANSWER',
        message: `You just answered the question: ${question.title}`,
        time: newAnswer.createAt,
        refID: question._id,
      },
    });

    // subscriber
    question.subscribers.forEach(sub => {
      if (!author._id.equals(sub._id))
        pubsub.publish(`user ${sub._id}`, {
          inbox: {
            type: 'NOTIFICATION', 
            message: `Somebody just answered the question: ${question.title}`,
            time: newAnswer.createAt,
            refID: question._id,
          },
        });
    });

    return newAnswer;
  }),

  createComment: isAuthenticated(async (parent, { text, postID, postType }, { db, pubsub, user }) => {
    if (!text || !postID || !postType)
      throw new Error("Missing some information for a valid comment");
    const author = user;
    if (postType == 'question') {
      var post = await db.QuestionModel.findById(postID);
    } else if (postType == 'answer') {
      var post = await db.AnswerModel.findById(postID);
    }
    if(!post) throw new Error(`PostID ${postID} not found.`);

    const newComment = new db.CommentModel({ author, post, postType, text });
    await newComment.save();

    author.answers.push(newComment);
    await author.save();

    post.comments.push(newComment);
    await post.save();

    const question = (postType == 'question'? post : 
        await db.QuestionModel.findById(post.question));

    if(question.subscribers.findIndex(sub => author._id.equals(sub._id)) === -1) {
      question.subscribers.push(author);
      console.log(`Add ${author.email} to subscriber list`);
      await question.save();
    }

    // author
    pubsub.publish(`user ${author._id}`, {
      inbox: {
        type: 'REPLY',
        message: `You just replied a question: ${question.title}`,
        time: newComment.createAt,
        refID: question._id,
      },
    });
    
    // subscriber
    question.subscribers.forEach(sub => {
      if (!author._id.equals(sub._id))
        pubsub.publish(`user ${sub._id}`, {
          inbox: {
            type: 'NOTIFICATION', 
            message: `Somebody just replied the question: ${question.title}`,
            time: newComment.createAt,
            refID: question._id,
          },
        });
    });

    return newComment;
  }),

  updateUser: isAuthenticated(async (parent, { avatar }, { db, user }) => {
    if(avatar) user.avatar = avatar;
    await user.save();
    return user;
  }),

  likeAnswer: isAuthenticated(async (parent, { aID }, { db, user }) => {
    const answer = await db.AnswerModel.findById(aID);
    if(!answer)
      throw new Error(`AnswerID ${aID} is not found.`)
    answer.like = answer.like + 1;
    await answer.save();
    return answer.like;
  }),

  reset: async(parent, args, { db }) => {
    try {
      await db.UserModel.deleteMany();
      await db.QuestionModel.deleteMany();
      await db.AnswerModel.deleteMany();
      await db.CommentModel.deleteMany();
      console.log('All Data successfully deleted');
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
};

export { Mutation as default };
