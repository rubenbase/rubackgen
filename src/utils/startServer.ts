import { createTypeormConn } from "./createTypeormConn";
import { User } from "../models/User";

export const startServer = async () => {
  // GraphQL & Redis Configuration
  const { server, redis } = require("../config/server");

  // Load express routes
  // require("../routes/authRoutes")(server);  <- In the future we can modularize
  server.express.get("/confirm/:id", async (req: any, res: any) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      await redis.del(id);
      res.send("Ok");
    } else {
      res.send("Invalid");
    }
  });

  // Creates TypeORM connection
  await createTypeormConn();

  // Starts the server
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });

  console.log("\nServer is running on http://localhost:4000");

  return app;
};
