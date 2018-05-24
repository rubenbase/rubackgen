import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeormConn } from "./createTypeormConn";
import { User } from "../models/User";
import Redis = require("ioredis");
import fetch from "node-fetch";

let userId: string;
const redis = new Redis();

beforeAll(async () => {
  await createTypeormConn();
  const user = await User.create({
    email: "example3@rubackgen.com",
    password: "bhdsjvbshjdv"
  }).save();
  userId = user.id;
});
describe("Test createConfirmEmailLink", () => {
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

  test("Sends invalid back if a bad ID is sent", async () => {
    const response = await fetch(`${process.env.TEST_HOST}/confirm/12345`);
    const text = await response.text();
    expect(text).toEqual("Invalid");
  });
});
