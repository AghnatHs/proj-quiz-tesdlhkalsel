import db from "./connection.mjs";

const AdminDashboardQuery = {
  getSessionsReport: async function () {
    const [results] = await db.query(`SELECT * FROM sessions`);
    return results;
  },
  getAllQuestions: async function () {
    const [results] = await db.query(
      `SELECT  
      id,
      content,
      option1,
      option2,
      option3,
      option4,
      option5,
      option_correct,
      subject,
      difficulty
      FROM questions`
    );
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
  deleteQuestionById: async function (questionId) {
    const [results] = await db.query(`DELETE FROM questions WHERE id = ?`, [
      questionId,
    ]);
    return results;
  },
};

export default AdminDashboardQuery;
