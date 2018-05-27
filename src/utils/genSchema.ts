import * as path from "path";
import * as fs from "fs";
import { GraphQLSchema } from "graphql";
import { importSchema } from "graphql-import";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";

export const genSchema = () => {
  const schemas: GraphQLSchema[] = [];

  const folders = fs.readdirSync(path.join(__dirname, "../graphql"));
  folders.forEach((folder: any) => {
    const { resolvers } = require(`../graphql/${folder}/resolvers`);
    const typeDefs = importSchema(
      path.join(__dirname, `../graphql/${folder}/schema.graphql`)
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  return mergeSchemas({ schemas });
};
