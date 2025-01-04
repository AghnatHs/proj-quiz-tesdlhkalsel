import db from "./connection.mjs";

const ExamSessionQuery = {
  changeExamPassword: async function (password) {
    const [results] = await db.query(`UPDATE exam_password SET password = ? `, [
      password,
    ]);
    return results;
  },
  createSession: async function ({
    id,
    userId,
    attempter,
    telephone,
    address,
    lastEducation,
    fromEducation,
    startTimestamp,
    endTimestamp,
  }) {
    const [results] = await db.query(
      `INSERT INTO sessions (
        id, 
        user_id, 
        attempter, 
        telephone, 
        address, 
        last_education, 
        from_education, 
        start_timestamp, 
        end_timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        attempter,
        telephone,
        address,
        lastEducation,
        fromEducation,
        startTimestamp,
        endTimestamp,
      ]
    );
    return results;
  },
  deleteQuestionAfterFinish: async function (sessionId) {
    const [results] = await db.query(
      `DELETE FROM session_questions_rel WHERE session_id = ?`,
      [sessionId]
    );
    return results[0];
  },
  getExamPassword: async function () {
    const [results] = await db.query(`SELECT * FROM exam_password`);
    return results[0];
  },
  getSession: async function (sessionId, userId) {
    const [results] = await db.query(
      `SELECT * FROM sessions WHERE id = ? AND user_id = ?`,
      [sessionId, userId]
    );
    return results[0];
  },
  getSessionDirect: async function (sessionId) {
    const [results] = await db.query(`SELECT * FROM sessions WHERE id = ?`, [
      sessionId,
    ]);
    return results[0];
  },
  getAnswersOfSession: async function (sessionId) {
    const [results] = await db.query(
      `
      SELECT 
        sqr.session_id, 
        sqr.question_id, 
        q.content, 
        q.option1,
        q.option2,
        q.option3,
        q.option4,
        q.option5,
        q.option_correct ,
        q.subject, 
        q.difficulty, 
        sqr.selected_option 
      FROM session_questions_rel sqr 
      INNER JOIN questions q ON sqr.question_id  = q.id
      WHERE sqr.session_id = ?
    `,
      [sessionId]
    );
    return results;
  },
  getQuestionOfSessionPerPage: async function (sessionId, page) {
    const [results] = await db.query(
      `
      SELECT 
        sqr.session_id, 
        sqr.question_id, 
        q.image_blob,
        q.content, 
        q.option1,
        q.option2,
        q.option3,
        q.option4,
        q.option5,
        q.subject, 
        q.difficulty, 
        sqr.selected_option 
      FROM session_questions_rel sqr 
      INNER JOIN questions q ON sqr.question_id  = q.id
      WHERE sqr.session_id = ?
      LIMIT ?,1;
     `,
      [sessionId, page]
    );
    return results[0];
  },
  insertQuestionsIntoSession: async function (sessionId) {
    const subjects = [
      "Penalaran Logis",
      "Logika Angka",
      "Analogi Verbal",
      "Tes Antonim dan Sinonim",
      "Tes Gambar dan Inggris",
    ];

    for (const subject of subjects) {
      await db.query(
        `INSERT INTO session_questions_rel (session_id , question_id)
          SELECT ?, id
            FROM questions
            WHERE difficulty = "Mudah" AND subject = ?
            ORDER BY RAND()
          LIMIT 10;`,
        [sessionId, subject]
      );
      await db.query(
        `INSERT INTO session_questions_rel (session_id , question_id)
          SELECT ?, id
            FROM questions
            WHERE difficulty = "Sedang" AND subject = ?
            ORDER BY RAND()
          LIMIT 5;`,
        [sessionId, subject]
      );
      await db.query(
        `INSERT INTO session_questions_rel (session_id , question_id)
          SELECT ?, id
            FROM questions
            WHERE difficulty = "Sulit" AND subject = ?
            ORDER BY RAND()
          LIMIT 5;`,
        [sessionId, subject]
      );
    }
  },
  postAnswer: async function (sessionId, questionId, answer) {
    const [results] = await db.query(
      `UPDATE session_questions_rel SET selected_option = ? WHERE session_id = ? AND question_id = ?`,
      [answer, sessionId, questionId]
    );
    return results;
  },
  setSessionRemainingTime: async function (sessionId, remainingTime) {
    const [results] = await db.query(
      `UPDATE sessions SET remaining_duration = ? WHERE id = ? `,
      [remainingTime, sessionId]
    );
    return results;
  },
  setSessionStatus: async function (sessionId, status) {
    const [results] = await db.query(
      `UPDATE sessions SET status = ? WHERE id = ? `,
      [status, sessionId]
    );
    return results;
  },
  setSessionScore: async function (sessionId, score) {
    const [results] = await db.query(
      `UPDATE sessions SET score = ? WHERE id = ? `,
      [score, sessionId]
    );
    return results;
  },
};

export default ExamSessionQuery;
