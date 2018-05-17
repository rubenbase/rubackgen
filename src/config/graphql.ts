import * as path from "path";
import * as fs from "fs";

import { importSchema } from "graphql-import";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";
import { GraphQLServer } from "graphql-yoga";
import { GraphQLSchema } from "graphql";

const schemas: GraphQLSchema[] = [];

// Iterates over folders and build the executable schemas
const folders = fs.readdirSync(path.join(__dirname, "../graphql"));
folders.forEach((folder: any) => {
  const { resolvers } = require(`../graphql/${folder}/resolvers`);
  const typeDefs = importSchema(
    path.join(__dirname, `../graphql/${folder}/schema.graphql`)
  );
  schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
});

// Creates the GraphQL server
const server = new GraphQLServer({ schema: mergeSchemas({ schemas }) });

module.exports.server = server;
