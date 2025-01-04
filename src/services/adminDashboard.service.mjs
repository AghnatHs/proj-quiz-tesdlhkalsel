import AdminDashboardQuery from "../database/adminDashboard.query.mjs";
import ExamSessionQuery from "../database/examSession.query.mjs";
import { msToRemainingTime } from "../utils/utils.mjs";
import AdminDashboardSchema from "../validators/adminDashboard.schema.mjs";
import validate from "../validators/validator.mjs";

const AdminDashboardService = {
  getOrRefreshSessions: async (req) => {
    let sessions = await AdminDashboardQuery.getSessionsReport();

    for (const session of sessions) {
      const sessionAnswers = await ExamSessionQuery.getAnswersOfSession(
        session.id
      );
      if (sessionAnswers.length !== 0) {
        let score = 0;
        for (const question of sessionAnswers) {
          const { selected_option, option_correct } = question;

          if (selected_option === null) score = score;
          else if (selected_option === option_correct) score = score + 4;
          else if (selected_option !== option_correct) score = score - 1;
        }
        await ExamSessionQuery.setSessionScore(session.id, score);
      }

      const nowTimestamp = new Date();
      const endTimestamp = new Date(session.end_timestamp);
      const remainingTime = endTimestamp - nowTimestamp;

      let remainingTimeFormatted;
      if (remainingTime < 0) {
        remainingTimeFormatted = "00:00:00";
        await ExamSessionQuery.setSessionStatus(session.id, "Finished");
        await ExamSessionQuery.deleteQuestionAfterFinish(session.id);
      } else {
        remainingTimeFormatted = msToRemainingTime(remainingTime);
      }

      const sessionz = await ExamSessionQuery.getSessionDirect(session.id);
      if (sessionz.status !== "finished")
        await ExamSessionQuery.setSessionRemainingTime(
          session.id,
          remainingTimeFormatted
        );
    }

    sessions = await AdminDashboardQuery.getSessionsReport();
    return sessions;
  },
  getAllQuestions: async (req) => {
    const questions = await AdminDashboardQuery.getAllQuestions();
    return questions;
  },
  createNewQuestion: async (req) => {
    const newQuestion = validate(
      AdminDashboardSchema.createNewQuestion,
      req.body
    );

    await AdminDashboardQuery.createNewQuestion(newQuestion);

    return newQuestion;
  },
  deleteQuestionById: async (req) => {
    const { id } = req.params;

    const result = await AdminDashboardQuery.deleteQuestionById(id);

    return result.affectedRows ? "Successfully delete" : "Nothing changed";
  },
};

export default AdminDashboardService;
