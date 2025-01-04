import Joi from "joi";

const ExamSessionSchema = {
  changeExamPassword: Joi.object({
    password: Joi.string().required().messages({
      "string.empty": "Valid password is required",
      "any.required": "Valid password is required",
    }),
  }),
  create: Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Valid name is required",
      "any.required": "Valid name is required",
    }),
    telephone: Joi.string().required(),
    address: Joi.string().required(),
    last_education: Joi.string().max(50).required(),
    from_education: Joi.string().max(125).required(),
    exam_password: Joi.string().required().messages({
      "string.empty": "Valid exam password is required",
      "any.required": "Valid exam password is required",
    }),
  }),
  postAnswer: Joi.object({
    answer: Joi.string().allow(null),
  }),
};

export default ExamSessionSchema;
