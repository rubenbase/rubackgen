import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../models/User";
import { Connection } from "typeorm";
import { TestClient } from "../../utils/TestClient";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";
import Redis = require("ioredis");
import { forgotPasswordLockAccount } from "../../utils/forgotPasswordLockAccount";
import {
  forgotPasswordLockedError,
  passwordNotLongEnough,
  expiredKeyError
} from "../../utils/errorMessages";

const redis = new Redis();
let conn: Connection;
const email = "example3@rubackgen.com";
const password = "bhdsjvbshjdv";
const newPassword = "dsvdsfvsdvsdfvsdvfds";
let userId: string;

beforeAll(async () => {
  conn = await createTypeormConn();
  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
});

describe("forgot password", () => {
  test("make sure forgot password works", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    // lock account
    await forgotPasswordLockAccount(userId, redis);
    const url = await createForgotPasswordLink("", userId, redis);

    const parts = url.split("/");
    const key = parts[parts.length - 1];

    // make sure you can't login to locked account
    expect(await client.login(email, password)).toEqual({
      data: {
        login: [
          {
            path: "email",
            message: forgotPasswordLockedError
          }
        ]
      }
    });

    // try changing to a password that's too short
    expect(await client.forgotPasswordChange("as", key)).toEqual({
      data: {
        forgotPasswordChange: [
          {
            path: "newPassword",
            message: passwordNotLongEnough
          }
        ]
      }
    });

    const response = await client.forgotPasswordChange(newPassword, key);

    expect(response.data).toEqual({
      forgotPasswordChange: null
    });

    // make sure redis key expires after password change
    expect(await client.forgotPasswordChange("dvasvsavsavs", key)).toEqual({
      data: {
        forgotPasswordChange: [
          {
            path: "key",
            message: expiredKeyError
          }
        ]
      }
    });

    expect(await client.login(email, newPassword)).toEqual({
      data: {
        login: null
      }
    });
  });
});
