import db from "./connection.mjs";

const AdminDashboardQuery = {
  getSessionsReport: async function () {
    const [results] = await db.query(`SELECT * FROM sessions`);
    return results;
  },
  createNewQuestion: async function ({
    content,
    option1,
    option2,
    option3,
    option4,
    option5,
    option_correct,
    subject,
    difficulty,
  }) {
    const [results] = await db.query(
      `
      INSERT INTO questions (content, option1, option2, option3, option4, option5, option_correct, subject, difficulty)
      values(?, ?, ?, ?, ?, ?, ?, ?, ?)  
    `,
      [
        content,
        option1,
        option2,
        option3,
        option4,
        option5,
        option_correct,
        subject,
        difficulty,
      ]
    );
    return results;
  },
};

export default AdminDashboardQuery;
