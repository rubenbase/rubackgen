import * as path from "path";
import * as fs from "fs";
import { GraphQLSchema } from "graphql";
import { importSchema } from "graphql-import";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";

/******************************************************************
 * Creates a recursive search in the graphql folder for pairs
 * of resolvers and schemas.
 *
 * DO NOT create 2 RESOLVERS or 2 SCHEMAS in the SAME folder
 ******************************************************************/

export const genSchema = () => {
  return (() => {
    const schemas: GraphQLSchema[] = [];

    let resolvers: any;
    let typeDefs: any;
    let resolversAdded: boolean = false;
    let typeDefsAdded: boolean = false;

    const recursiveSearch = (dir: any) => {
      const files: any = fs.readdirSync(dir);
      files.forEach((file: any) => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
          recursiveSearch(path.join(dir, file));
        } else {
          if (path.join(dir, file).endsWith("s.ts")) {
            resolvers = require(path.join(dir, file));
          }
          if (path.join(dir, file).endsWith("l")) {
            typeDefs = importSchema(path.join(dir, file));
          }
          if (resolversAdded && typeDefsAdded) {
            schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
            resolversAdded = false;
            typeDefsAdded = false;
          }
        }
      });
    };

    recursiveSearch(path.join(__dirname, "../graphql"));

    console.log(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA => ",
      mergeSchemas({ schemas })
    );
    return mergeSchemas({ schemas });
  })();
};
