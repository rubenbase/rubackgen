import { createTypeormConn } from "./createTypeormConn";
import { User } from "../models/User";

export const startServer = async () => {
  // GraphQL & Redis Configuration
  const { server, redis } = require("../config/server");

  // Load express routes
  const authRoute = require("../routes/authRoutes")(User, redis);

  // Mount routes
  server.express.use("/auth", authRoute);

  // Creates TypeORM connection
  await createTypeormConn();

  // Starts the server
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });

  console.log("\nServer is running on http://localhost:4000");

  return app;
};
