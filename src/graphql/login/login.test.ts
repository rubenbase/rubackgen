import { request } from "graphql-request";
import { invalidLogin, confirmEmailError } from "../../utils/errorMessages";
import { User } from "../../models/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { Connection } from "typeorm";

const email = "bobds@bob.com";
const password = "123456";

const registerMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

let conn: Connection;
beforeAll(async () => {
  conn = await createTypeormConn();
});
afterAll(async () => {
  conn.close();
});

const loginExpectError = async (e: string, p: string, errMsg: string) => {
  const response = await request(
    process.env.TEST_HOST as string,
    loginMutation(e, p)
  );

  expect(response).toEqual({
    login: [
      {
        path: "email",
        message: errMsg
      }
    ]
  });
};

describe("login", () => {
  test("email not found send back error", async () => {
    await loginExpectError("bob@bob.com", "whatever", invalidLogin);
  });

  test("email not confirmed", async () => {
    // We register an user.
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );

    // We expect an error as we didn't confirm the email.
    await loginExpectError(email, password, confirmEmailError);

    // We confirm the email.
    await User.update({ email }, { confirmed: true });

    // We try to login with bad password.
    await loginExpectError(email, "fvzdvzvxcv", invalidLogin);

    // We login correctly.
    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );
    expect(response).toEqual({ login: null });
  });
});
