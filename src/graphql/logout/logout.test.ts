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

describe("logout", () => {
  test("multiple sessions", async () => {
    // computer 1
    const session1 = new TestClient(process.env.TEST_HOST as string);
    // computer 2
    const session2 = new TestClient(process.env.TEST_HOST as string);

    await session1.login(email, password);
    await session2.login(email, password);

    expect(await session1.me()).toEqual(await session2.me());
  });

  test("single session", async () => {
    // Create our client
    const client = new TestClient(process.env.TEST_HOST as string);

    // We login
    await client.login(email, password);

    // We get the cookie
    const response = await client.me();

    // We compare the data of the cookie to see if matches
    expect(response.data).toEqual({
      me: {
        id: userId,
        email
      }
    });

    // client logout
    await client.logout();

    // We get the cookie
    const response2 = await client.me();

    expect(response2.data.me).toBeNull();
  });
});