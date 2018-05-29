import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../models/User";
import { Connection } from "typeorm";
import { TestClient } from "../../utils/TestClient";

let conn: Connection;
const email = "example3@rubackgen.com";
const password = "bhdsjvbshjdv";
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

describe("me", () => {
  test("return null if no cookie", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    // We get the cookie
    const response = await client.me();
    expect(response.data.me).toBeNull();
  });

  test("get current user", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    // we login
    await client.login(email, password);

    // we get the cookie
    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        id: userId,
        email
      }
    });
  });
});
