import Joi from "joi";
import AdminDashboardQuery from "../database/adminDashboard.query.mjs";

const AdminDashboardSchema = {
  createNewQuestion: Joi.object({
    content: Joi.string().required(),
    option1: Joi.string().required(),
    option2: Joi.string().required(),
    option3: Joi.string().required(),
    option4: Joi.string().required(),
    option5: Joi.string().required(),
    option_correct: Joi.string().required(),
    subject: Joi.string().required(),
    difficulty: Joi.string().required(),
  }),
};

export default AdminDashboardSchema;
