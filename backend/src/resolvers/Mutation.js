import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isAuthenticated from '../authentication';
import Joi from 'joi';

// 定義 bcrypt 加密所需 saltRounds 次數
const SALT_ROUNDS = 2;
// 定義 jwt 所需 secret (隨意)
const SECRET = 'epistemologyet';

// content validator
const schema = Joi.object({
  username: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]*'))
      .min(3)
      .max(30),

  password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]*'))
      .min(3)
      .max(30),

  email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  
  title: Joi.string()
      .pattern(/^(?![%&?!.@])[\u4e00-\u9fa5_a-zA-Z0-9_%&?!.@]+$/u),
})

/* -------------------------------------------------------------------------- */
/*                                  UTILITIES                                 */
/* -------------------------------------------------------------------------- */

const hash = text => bcrypt.hash(text, SALT_ROUNDS);

const addUser = async ({ db, username, email, password }) => {
  return new db.UserModel({ username, email, password }).save();
};

const createToken = ({ _id, email, username }) => { 
  const id = _id.toString();
  return jwt.sign({ id, email, username }, SECRET, { expiresIn: '1d' });
};

const addMail = async ({ db, type, message, time, refID }) => {
  return new db.MailModel({ type, message, time, refID }).save();
}

const delMail = async({ db, id }) => {
  return db.MailModel.deleteOne({id});
}

/* -------------------------------------------------------------------------- */
/*                                  MUTATION                                  */
/* -------------------------------------------------------------------------- */

const Mutation = {
  signup: async (parent, { username, password, email }, { db }, info) => {
    if (!username || !password || !email)
      throw new Error("Missing some information for sign up");
    try {
        await schema.validateAsync({ email, password });
    } catch (err) {
        throw new Error(`${err.message}`);
    }  
    const existing = await db.UserModel.findOne({ email });
    if (existing) throw new Error(`Email account ${email} has been registered.`);

    // encrypt password
    const hashedPassword = await hash(password, SALT_ROUNDS);
    return await addUser({ db, username, email, password: hashedPassword });
  },

  login: async (parent, { email, password }, { db }, info) => {
    if (!password || !email)
      throw new Error("Missing some information for log in");
    try {
        await schema.validateAsync({ email, password });
    } catch (err) {
        throw new Error(`${err.message}`);
    }  
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
    try {
        await schema.validateAsync({ title });
        await Joi.number().integer().max(user.points).validateAsync(reward);
    } catch (err) {
        throw new Error(`${err.message}`);
    }  
    const newQuestion = new db.QuestionModel({ 
      title, body, author, reward,
      views: 0,
      subscribers: [author] 
    });
    await newQuestion.save();

    author.questions.push(newQuestion);
    await author.save();

    /////////////////////// Inbox ///////////////////////

    const mailPayload = {
      type: 'ASK', 
      message: `You just asked a question: ${newQuestion.title}`,
      time: newQuestion.createdAt.toISOString(),
      qID: newQuestion._id,
      // refID: newQuestion._id,
    };

    pubsub.publish(`user ${author._id}`, {
      inbox: newMail,
    });

    const newMail = new db.MailModel(mailPayload);
    await newMail.save();

    author.inbox.push(newMail);
    await author.save();

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
    
    /////////////////////// Inbox ///////////////////////

    // author
    const mailPayload = {
      type: 'ANSWER',
      message: `You answered a question: ${question.title}`,
      time: newAnswer.createdAt.toISOString(),
      qID: question._id,
      refID: newAnswer._id,
    }
    
    const newMail = new db.MailModel(mailPayload);
    await newMail.save();

    author.inbox.push(newMail);
    await author.save();
    
    pubsub.publish(`user ${author._id}`, {
      inbox: newMail,
    });

    // subscriber
    question.subscribers.forEach(async sub => {
      if (!author._id.equals(sub._id)) {

        const subscriber = await db.UserModel.findById(sub._id);

        const mailPayload = {
          type: 'NOTIFICATION', 
          message: `@${author.username} answered the question: ${question.title}`,
          time: newAnswer.createdAt.toISOString(),
          qID: question._id,
          refID: newAnswer._id,
        };       
        
        const newMail = new db.MailModel(mailPayload);
        await newMail.save();

        subscriber.inbox.push(newMail);
        await subscriber.save();

        pubsub.publish(`user ${sub._id}`, {
          inbox: newMail,
        });
      }
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

    /////////////////////// Inbox ///////////////////////

    // author
    const mailPayload = {
        type: 'COMMENT',
        message: `You commented a question: ${question.title}`,
        time: newComment.createdAt.toISOString(),
        qID: question._id,
        refID: newComment._id
    };

    const newMail = new db.MailModel(mailPayload);
    await newMail.save();

    author.inbox.push(newMail);
    await author.save();

    pubsub.publish(`user ${author._id}`, {
      inbox: newMail,
    });
    
    // subscriber
    question.subscribers.forEach(async sub => {
      if (!author._id.equals(sub._id)) {

        const subscriber = await db.UserModel.findById(sub._id);

        const mailPayload = {
            type: 'NOTIFICATION', 
            message: `@${author.username} commented the question: ${question.title}`,
            time: newComment.createdAt.toISOString(),
            qID: question._id,
            refID: newComment._id
        };
        
        const newMail = new db.MailModel(mailPayload);
        await newMail.save();

        subscriber.inbox.push(newMail);
        await subscriber.save();

        pubsub.publish(`user ${sub._id}`, {
          inbox: newMail,
        });
      }
    });

    return newComment;
  }),

  updateUser: isAuthenticated(async (parent, { avatar }, { db, user }) => {
    if(avatar) user.avatar = avatar;
    await user.save();
    return user;
  }),

  likeAnswer: isAuthenticated(async (parent, { aID }, { db, user, pubsub }) => {
    const answer = await db.AnswerModel.findById(aID);
    if(!answer)
      throw new Error(`AnswerID ${aID} is not found.`)
    answer.like = answer.like + 1;
    await answer.save();
    
    const author = await db.UserModel.findById(answer.author);
    author.feedback = author.feedback + 1;
    await author.save();

    pubsub.publish(`userfeedback ${author._id}`, { feedback: author.feedback });

    return answer.like;
  }),

  readMail: isAuthenticated(async (parent, { mID }, { db, user }) => {
    if (mID) {
      await db.MailModel.findByIdAndUpdate(mID, { $set: { unread: false }}, function(err, res){
        if(err) console.log(err); return 0;});
    } else {
      // read all mails if not specified
      await db.MailModel.updateMany(
        {_id: user.inbox},
        {$set: {unread: false}},
        function(err, res){ if(err) console.log(err); return 0; });
    }
    return user.inbox.filter(m => m.unread).length;
  }),

  deleteMail: isAuthenticated(async (parent, { mID }, { db, user }) => {
    await user.inbox.pull(mID, function(err, docs){if(err) console.log(err); return false;});
    await db.MailModel.findOneAndDelete(mID, function(err, docs){if(err) console.log(err); return false;});
    return true;
  }),

  // reset: async(parent, args, { db }) => {
  //   try {
  //     await db.UserModel.deleteMany();
  //     await db.QuestionModel.deleteMany();
  //     await db.AnswerModel.deleteMany();
  //     await db.CommentModel.deleteMany();
  //     console.log('All Data successfully deleted');
  //     return true;
  //   } catch (e) {
  //     console.log(e);
  //     return false;
  //   }
  // }
};

export { Mutation as default };
