import { ApolloServer, PubSub, gql } from 'apollo-server';
//import { ApolloServer, PubSub, gql } from 'apollo-server-express';
import http from 'http';
import express from 'express';
import path from 'path';
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

const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 8000;

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
  playground: true,
  introspection: true,	
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

//const app = express();
// Allow CORS
//app.use((req, res, next) => {
//	   res.header('Access-Control-Allow-Origin', '*');
//	   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//	   next();
//});

//

// Setup for JSON and url encoded bodies
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

//server.start();
//server.applyMiddleware({ app });

//const httpServer = http.createServer(app);
//server.installSubscriptionHandlers(httpServer);

// frontend
//if (isProduction) {
  // set static folder
//  const publicPath = path.resolve(__dirname, "../../frontend/build");
//  app.use(express.static(publicPath));
//  app.get("*", function (request, response) {
//    response.sendFile(path.resolve(publicPath, "index.html"));
//  });
//}

//new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
//console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
//console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);

server.listen({ port: PORT }, () => {
   console.log(`The server is up on port ${PORT}!`);
}).then(({ url, subscriptionsUrl }) => {
   console.log(`Server ready at ${url}`);
   console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
