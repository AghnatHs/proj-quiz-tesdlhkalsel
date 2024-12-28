import AdminDashboardQuery from "../database/adminDashboard.query.mjs";
import ExamSessionQuery from "../database/examSession.query.mjs";
import { msToRemainingTime } from "../utils/utils.mjs";

const AdminDashboardService = {
  getOrRefreshSessions: async (req) => {
    let sessions = await AdminDashboardQuery.getSessionsReport();

    for (const session of sessions) {
      let score = 0;
      const sessionAnswers = await ExamSessionQuery.getAnswersOfSession(
        session.id
      );
      for (const question of sessionAnswers) {
        const { selected_option, option_correct } = question;

        if (selected_option === null) score = score;
        else if (selected_option === option_correct) score = score + 4;
        else if (selected_option !== option_correct) score = score - 1;
      }
      await ExamSessionQuery.setSessionScore(session.id, score);

      const nowTimestamp = new Date();
      const endTimestamp = new Date(session.end_timestamp);
      const remainingTime = endTimestamp - nowTimestamp;

      let remainingTimeFormatted;
      if (remainingTime < 0) {
        remainingTimeFormatted = "00:00";
        await ExamSessionQuery.setSessionStatus(session.id, "Finished");
      } else {
        remainingTimeFormatted = msToRemainingTime(remainingTime);
      }
      await ExamSessionQuery.setSessionRemainingTime(
        session.id,
        remainingTimeFormatted
      );
    }

    sessions = await AdminDashboardQuery.getSessionsReport();
    return sessions;
  },
};

export default AdminDashboardService;
