import bcrypt from "bcrypt";
import { v7 as uuidv7 } from "uuid";

import UserQuery from "../database/user.query.mjs";
import UserSchema from "../validators/user.schema.mjs";
import validate from "../validators/validator.mjs";
import {
  AuthorizationError,
  BadRequestError,
} from "../errors/customErrors.mjs";

const UserService = {
  get: async (req) => {
    if (req.user) {
      const { username } = req.user;
      const userFromDb = await UserQuery.getUser(username);
      return userFromDb;
    } else {
      throw new AuthorizationError("Unauthorized. Please log in");
    }
  },
  register: async (req) => {
    const newUser = validate(UserSchema.register, req.body);

    const isUsernameExist = await UserQuery.isUsernameExist(newUser.username);
    if (isUsernameExist)
      throw new BadRequestError("Username already registered");

    newUser.id = "user-" + uuidv7();
    newUser.hashedPassword = await bcrypt.hash(newUser.password, 10);

    await UserQuery.registerUser(
      newUser.id,
      newUser.username,
      newUser.hashedPassword
    );

    return {
      id: newUser.id,
      username: newUser.username,
    };
  },
};

export default UserService;
