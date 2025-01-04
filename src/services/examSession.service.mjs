import bcrypt from "bcrypt";
import { addMinutes } from "date-fns";
import { v7 as uuidV7 } from "uuid";

import ExamSessionQuery from "../database/examSession.query.mjs";
import ExamSessionSchema from "../validators/examSession.schema.mjs";
import validate from "../validators/validator.mjs";
import { AuthorizationError, NotFoundError } from "../errors/customErrors.mjs";
import { msToRemainingTime } from "../utils/utils.mjs";

const ExamSessionService = {
  changeExamPassword: async (req) => {
    let { password } = validate(ExamSessionSchema.changeExamPassword, req.body);

    password = await bcrypt.hash(password, 10);
    await ExamSessionQuery.changeExamPassword(password);

    return "Succesfully changed exam password";
  },
  checkStatus: async (req) => {
    const { session_id } = req.params;
    const { id: user_id } = req.user;
    const currentSession = await ExamSessionQuery.getSession(
      session_id,
      user_id
    );
    if (!currentSession) throw new AuthorizationError("Invalid session");
    if (currentSession.status === "finished")
      throw new AuthorizationError("Session already expired");

    const nowTimestamp = new Date();
    const endTimestamp = new Date(currentSession.end_timestamp);
    const remainingTime = endTimestamp - nowTimestamp;

    const sessionStatus = {};
    sessionStatus.expired = nowTimestamp > endTimestamp;
    sessionStatus.remaining_time_ms = remainingTime;

    let remainingTimeFormatted;
    if (sessionStatus.remaining_time_ms < 0) {
      remainingTimeFormatted = "00:00";
      sessionStatus.expired = true;
      sessionStatus.remaining_time_ms = 0;
      await ExamSessionQuery.setSessionStatus(currentSession.id, "Finished");
    } else {
      remainingTimeFormatted = msToRemainingTime(remainingTime);
    }
    sessionStatus.remaining_time = remainingTimeFormatted;

    await ExamSessionQuery.setSessionRemainingTime(
      session_id,
      remainingTimeFormatted
    );

    return sessionStatus;
  },
  create: async (req) => {
    const {
      name,
      telephone,
      address,
      last_education,
      from_education,
      exam_password: examPassword,
    } = validate(ExamSessionSchema.create, req.body);

    const timestamp = new Date();
    const newSession = {
      id: "session-" + uuidV7(),
      userId: req.user.id,
      attempter: name,
      telephone: telephone,
      address: address,
      lastEducation: last_education,
      fromEducation: from_education,
      startTimestamp: timestamp.toISOString(),
      endTimestamp: addMinutes(timestamp, 100).toISOString(),
    };

    const { password: examPasswordFromDb } =
      await ExamSessionQuery.getExamPassword();
    const isExamPasswordMatch = await bcrypt.compare(
      examPassword,
      examPasswordFromDb
    );
    if (!isExamPasswordMatch)
      throw new AuthorizationError("Wrong exam password");

    await ExamSessionQuery.createSession(newSession);
    await ExamSessionQuery.insertQuestionsIntoSession(newSession.id);
    const result = await ExamSessionQuery.getSession(
      newSession.id,
      newSession.userId
    );

    return result;
  },
  getQuestionOfSession: async (req) => {
    const { session_id } = req.params;
    let { page } = req.params;
    const { id: user_id } = req.user;
    const currentSession = await ExamSessionQuery.getSession(
      session_id,
      user_id
    );
    if (!currentSession) throw new AuthorizationError("Invalid session");
    await handleSessionExpiration(currentSession);
    if (currentSession.status === "finished")
      throw new AuthorizationError("Session already expired");

    page = page - 1;
    const result = await ExamSessionQuery.getQuestionOfSessionPerPage(
      session_id,
      page
    );
    if (!result) throw new NotFoundError("Question out of range");

    if (result.image_blob.length > 0) {
      try {
        const buffer = Buffer.from(result.image_blob);
        const base64Image = `data:image/jpeg;base64,${buffer.toString(
          "base64"
        )}`;
        result.image_blob = base64Image;
      } catch (error) {
        console.log(error);
      }
    } else {
      result.image_blob = null;
    }

    return result;
  },
  finishSession: async (req) => {
    const { session_id } = req.params;
    const { id: user_id } = req.user;
    const currentSession = await ExamSessionQuery.getSession(
      session_id,
      user_id
    );
    if (!currentSession) throw new AuthorizationError("Invalid session");
    await ExamSessionQuery.setSessionStatus(session_id, "finished");
    await ExamSessionQuery.setSessionRemainingTime(
      currentSession.id,
      "00:00:00"
    );

    const sessionAnswers = await ExamSessionQuery.getAnswersOfSession(
      session_id
    );
    if (sessionAnswers.length === 0)
      throw new NotFoundError("Session not found");

    let score = 0;
    for (const question of sessionAnswers) {
      const { selected_option, option_correct } = question;

      if (selected_option === null || selected_option === "" || selected_option === "Empty String") score = score;
      else if (selected_option === option_correct) score = score + 4;
      else if (selected_option !== option_correct) score = score - 1;
    }

    await ExamSessionQuery.setSessionScore(session_id, score);

    return { session_id: session_id, status: "finished"};
  },
  postAnswer: async (req) => {
    const { answer } = validate(ExamSessionSchema.postAnswer, req.body);
    const { session_id } = req.params;
    let { page } = req.params;
    const { id: user_id } = req.user;
    const currentSession = await ExamSessionQuery.getSession(
      session_id,
      user_id
    );
    if (!currentSession) throw new AuthorizationError("Invalid session");
    await handleSessionExpiration(currentSession);
    if (currentSession.status === "finished")
      throw new AuthorizationError("Session already expired");

    page = page - 1;
    const { question_id } = await ExamSessionQuery.getQuestionOfSessionPerPage(
      session_id,
      page
    );
    if (!question_id) throw new NotFoundError("Question out of range");

    await ExamSessionQuery.postAnswer(session_id, question_id, answer);

    return `${question_id} answered with ${answer}`;
  },
};

async function handleSessionExpiration(currentSession) {
  const nowTimestamp = new Date();
  const endTimestamp = new Date(currentSession.end_timestamp);
  const remainingTime = endTimestamp - nowTimestamp;

  if (remainingTime < 0) {
    await ExamSessionQuery.setSessionStatus(currentSession.id, "finished");
    await ExamSessionQuery.setSessionRemainingTime(
      currentSession.id,
      "00:00:00"
    );
    throw new AuthorizationError("Session expired and finished");
  }
}

export default ExamSessionService;
