import { ApolloServer, PubSub, gql } from 'apollo-server';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import db from './db';
import mongo from './mongo';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';
import Question from './resolvers/Question';
import Answer from './resolvers/Answer';
import Comment from './resolvers/Comment';

// 定義 jwt 所需 secret (隨意)
const SECRET = 'epistemologyet';

const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs: gql(fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')), 
  resolvers: {
    Query,
    Mutation,
    // Subscription,
    User,
    Question,
    Answer,
    Comment
  },
  context: async ({ req }) => {
    const token = req.headers.authentication;
    if (token) {
      try {
        const user = await jwt.verify(token, SECRET);
        return { db, pubsub, user };
      } catch (e) {
        throw new Error('Your session expired. Sign in again.');
      }
    }
    return { db, pubsub };
  },
});

mongo.connect();

server.listen({ port: process.env.PORT | 5000 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 5000}!`);
});
