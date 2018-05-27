import axios from "axios";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../models/User";
import { Connection } from "typeorm";

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

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const meQuery = `
{
  me {
    id
    email
  }
}
`;

describe("me", () => {
  test("can't get user if not logged in", async () => {
    // We get the cookie
    const response = await axios.post(process.env.TEST_HOST as string, {
      query: meQuery
    });

    expect(response.data.data.me).toBeNull();
  });

  test("get current user", async () => {
    // We login
    await axios.post(
      process.env.TEST_HOST as string,
      {
        query: loginMutation(email, password)
      },
      {
        withCredentials: true
      }
    );

    // We get the cookie
    const response = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery
      },
      {
        withCredentials: true
      }
    );

    // We compare the data of the cookie to see if matches
    expect(response.data.data).toEqual({
      me: {
        id: userId,
        email
      }
    });
  });
});
