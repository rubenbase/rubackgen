import { request } from "graphql-request";

import { User } from "../../models/User";
import { startServer } from "../../utils/startServer";

let host = "";

beforeAll(async () => {
  const app = await startServer();
  const { port }: any = app.address();
  host = `http://127.0.0.1:${port}`;
});

const email = "test@rubackgen.com";
const password = "12345";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;

test("Register user", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
  const response2: any = await request(host, mutation);
  expect(response2.register).toHaveLength(1);
  expect(response2.register[0].path).toEqual("email");
});
