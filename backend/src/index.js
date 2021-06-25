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

const PORT = process.env.PORT || 5000;
const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs: gql(fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')), 
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Question,
    Answer,
    Comment
  },
  playground: {
    subscriptionEndpoint: `ws://localhost:${PORT}/graphql`,
  },
  context: async ({ req, connection }) => {
    // Operation is a Subscription: 
    // Obtain connectionParams-provided token from connection.context
    // Operation is a Query/Mutation:
    // Obtain header-provided token from req.headers
    const token = (connection ? connection.context.authorization : req.headers.authorization);
    if (token) {
      try {
        const user = await jwt.verify(token, SECRET);
        return { db, pubsub, user };
      } catch (e) {
        throw new Error('Your session is expired. Please log in again.');
      }
    }
    return { db, pubsub };
  },
  // subscriptions: {
  //   onConnect: (connectionParams, webSocket) => {
  //     if (!connectionParams.authToken) throw new Error('Missing auth token!');
  //   },
  // },
});

mongo.connect();

server.listen({ port: PORT }, () => {
  console.log(`The server is up on port ${PORT}!`);
}).then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
