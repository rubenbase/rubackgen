import "reflect-metadata";
import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";
import { createConnection } from "typeorm";
import path = require("path");

const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));

const server = new GraphQLServer({ typeDefs, resolvers });

createConnection()
  .then(connection => {
    // here you can start to work with your entities
    console.log(connection);
  })
  .catch(error => console.log(error));

server.start(() => console.log("Server is running on localhost:4000"));
