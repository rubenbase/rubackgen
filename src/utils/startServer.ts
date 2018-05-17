import { createTypeormConn } from "./createTypeormConn";

export const startServer = async () => {
  // GraphQL Configuration
  const { server } = require("../config/graphql");

  // Creates TypeORM connection
  await createTypeormConn();

  // Starts the server
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });

  console.log("\nServer is running on http://localhost:4000");

  return app;
};
