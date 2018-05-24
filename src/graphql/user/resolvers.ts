import bcrypt = require("bcryptjs");
import * as yup from "yup";
import { User } from "../../models/User";
import { ResolverMap } from "../../types/graphql-utils";
import { formatYupError } from "../../utils/formatYupError";
import {
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "../../utils/errorMessages";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(invalidEmail),
  password: yup
    .string()
    .min(3, passwordNotLongEnough)
    .max(255)
});

export const resolvers: ResolverMap = {
  Query: {
    fix: () => "fix"
  },
  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments,
      { redis, url }
    ) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }
      const { email, password } = args;
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"]
      });
      if (userAlreadyExists) {
        return [
          {
            path: "email",
            message: "already taken"
          }
        ];
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword
      });
      await user.save();

      const link = await createConfirmEmailLink(url, user.id, redis);
      return null;
    }
  }
};
