import { request } from "graphql-request";
import { User } from "../../models/User";
import { startServer } from "../../utils/startServer";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "../../utils/errorMessages";

let host = "";

beforeAll(async () => {
  const app = await startServer();
  const { port }: any = app.address();
  host = `http://127.0.0.1:${port}`;
});

const email = "test@rubackgen.com";
const password = "123456";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

describe("Register user", async () => {
  it("Check for duplicate emails", async () => {
    // make sure we can register a user
    const response = await request(host, mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    // test for duplicate emails
    const response2: any = await request(host, mutation(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  it("Check bad email", async () => {
    // catch bad email
    const response3: any = await request(host, mutation("b", password));
    expect(response3).toEqual({
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
    // catch bad password
    const response4: any = await request(host, mutation(email, "ad"));
    expect(response4).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });

  it("Check bad password and bad email", async () => {
    // catch bad password and bad email
    const response5: any = await request(host, mutation("df", "ad"));
    expect(response5).toEqual({
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
