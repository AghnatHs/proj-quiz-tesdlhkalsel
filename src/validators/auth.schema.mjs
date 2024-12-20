import Joi from "joi";

const AuthSchema = {
  login: Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "Valid username is required",
      "string.email": "Username not valid",
      "any.required": "Valid username is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  }),
};

export default AuthSchema;
