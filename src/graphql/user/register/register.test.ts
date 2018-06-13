import { request } from "graphql-request";
import { User } from "../../../models/User";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "../../../utils/validation/errorMessages";
import { Connection } from "typeorm";
import { TestClient } from "../../../utils/testing/TestClient";
import { createTestConn } from "../../../utils/testing/createTestConn";
import faker = require("faker");

faker.seed(Date.now() + 5);

const email = faker.internet.email();
const password = faker.internet.password();

let conn: Connection;
beforeAll(async () => {
  conn = await createTestConn();
});
afterAll(async () => {
  conn.close();
});

describe("Register user", async () => {
  it("Check for duplicate emails", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    // make sure we can register a user
    const response = await client.register(email, password);
    expect(response.data).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    // test for duplicate emails
    const response2 = await client.register(email, password);

    expect(response2.data.register).toHaveLength(1);
    expect(response2.data.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  it("Check bad email", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    // catch bad email
    const response3 = await client.register("b", password);
    expect(response3.data).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        }
      ]
    });
  });

  it("Check bad password", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    // catch bad password
    const response4 = await client.register(faker.internet.email(), "aa");

    expect(response4.data).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });

  it("Check bad password and bad email", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    // catch bad password and bad email
    const response5 = await client.register("df", "ad");

    expect(response5.data).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        },
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });
});
