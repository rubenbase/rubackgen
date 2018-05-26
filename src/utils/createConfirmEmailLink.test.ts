import { Connection } from "typeorm";
import Redis = require("ioredis");
import fetch from "node-fetch";

import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeormConn } from "./createTypeormConn";
import { User } from "../models/User";

let userId: string;
const redis = new Redis();

let conn: Connection;

beforeAll(async () => {
  conn = await createTypeormConn();
  const user = await User.create({
    email: "example3@rubackgen.com",
    password: "bhdsjvbshjdv"
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
});

test("Make sure it confirms user and clears key in redis", async () => {
  const url = await createConfirmEmailLink(
    process.env.TEST_HOST as string,
    userId,
    new Redis()
  );

  const response = await fetch(url);
  const text = await response.text();
  expect(text).toEqual("Ok");
  const user = await User.findOne({ where: { id: userId } });
  expect((user as User).confirmed).toBeTruthy();
  const chunks = url.split("/");
  const key = chunks[chunks.length - 1];
  const value = await redis.get(key);
  expect(value).toBeNull();
});
