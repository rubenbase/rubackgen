import { invalidLogin, confirmEmailError } from "../../utils/errorMessages";
import { User } from "../../models/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { Connection } from "typeorm";
import { TestClient } from "../../utils/TestClient";

const email = "bobds@bob.com";
const password = "123456";

let conn: Connection;
beforeAll(async () => {
  conn = await createTypeormConn();
});
afterAll(async () => {
  conn.close();
});

const loginExpectError = async (
  client: TestClient,
  e: string,
  p: string,
  errMsg: string
) => {
  // We login
  const response = await client.login(e, p);

  expect(response.data).toEqual({
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
    // Create our client
    const client = new TestClient(process.env.TEST_HOST as string);

    await loginExpectError(client, "bob@bob.com", "whatever", invalidLogin);
  });

  test("email not confirmed", async () => {
    // Create our client
    const client = new TestClient(process.env.TEST_HOST as string);

    // We register an user.
    await client.register(email, password);

    // We expect an error as we didn't confirm the email.
    await loginExpectError(client, email, password, confirmEmailError);

    // We confirm the email.
    await User.update({ email }, { confirmed: true });

    // We try to login with bad password.
    await loginExpectError(client, email, "fvzdvzvxcv", invalidLogin);

    // We login correctly.
    const response = await client.login(email, password);
    expect(response.data).toEqual({ login: null });
  });
});
