import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';
import { COOKIE_NAME, __prod__ } from './constants';
import { ResolverContext } from './types';
import Redis from 'ioredis';
import { typeormDataSource } from './typeormDatasource';
import { ConvoResolver } from './resolvers/convo';
import { ConvoEntryResolver } from './resolvers/convoEntry';
import { ConvoEntryResponseResolver } from './resolvers/convoEntryResponse';
import cors from "cors";
const session = require('express-session')
const RedisStore = require('connect-redis')(session)


const main = async () => {

  await typeormDataSource.initialize();
  if (__prod__) {
    await typeormDataSource.runMigrations();
  }

  const app = express();
  app.set('trust proxy', !__prod__);

  const redisClient = new Redis(process.env.REDIS_URL);

  app.set('trust proxy', 1);
  app.use(cors({
    origin: [
      'http://localhost:4000/graphql',
      process.env.CORS_ORIGIN,
      'https://studio.apollographql.com'
    ],
    credentials: true
  }));
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: __prod__ ? ".convodrill.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        ConvoResolver,
        ConvoEntryResolver,
        ConvoEntryResponseResolver
      ],
      validate: false
    }),
    context: ({req, res}): ResolverContext => ({
      req,
      res,
      redis: redisClient
    })
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app: app,
    cors: false
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log('Server started on localhost:4000');
  });
}

main().catch(err => console.error(err));