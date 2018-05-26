import "reflect-metadata";
import dotenv = require("dotenv");

import { startServer } from "./utils/startServer";

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

startServer();
