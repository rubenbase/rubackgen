import "reflect-metadata";
import dotenv = require("dotenv");
import session = require("express-session");
import connectRedis = require("connect-redis");

import { createTypeormConn } from "./createTypeormConn";
import { User } from "../models/User";

const SESSION_SECRET = "sdbvsahvasv";
const RedisStore = connectRedis(session);

export const startServer = async () => {
  // Load .env config
  const result = dotenv.config();

  if (result.error) {
    throw result.error;
  }

  // GraphQL & Redis Configuration
  const { server, redis } = require("../config/server");

  // Load middlewares
  server.express.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // needs https on production
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  const cors = {
    credentials: true,
    origin:
      process.env.NODE_ENV === "test"
        ? "*"
        : (process.env.FRONTEND_HOST as string) // Depends on where the front-end is
  };

  // Load express routes
  const authRoute = require("../routes/authRoutes")(User, redis);

  // Mount routes
  server.express.use("/auth", authRoute);

  // Creates TypeORM connection
  await createTypeormConn();

  // Starts the server
  const app = await server.start({
    cors,
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });

  console.log("\nServer is running on http://localhost:4000");

  return app;
};
