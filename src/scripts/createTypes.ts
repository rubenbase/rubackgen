import { generateNamespace } from "@gql2ts/from-schema";
import * as path from "path";
import * as fs from "fs";

import { genSchema } from "../utils/genSchema";

const typescriptTypes = generateNamespace("GQL", genSchema());
console.log(
  "typescriptTypes typescriptTypes typescriptTypes =>",
  typescriptTypes
);
fs.writeFile(
  path.join(__dirname, "../types/schema.d.ts"),
  typescriptTypes,
  err => {
    console.log(err);
  }
);
