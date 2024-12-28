import { Router } from "express";

import ExamSessionController from "../controllers/examSession.controller.mjs";
import authenticateHandler from "../middlewares/auth.middleware.mjs";

const examSessionRouter = Router();

examSessionRouter.post(
  "/api/session/password",
  authenticateHandler("jwt"),
  async (req, res, next) =>
    ExamSessionController.changeExamPassowrd(req, res, next)
);

examSessionRouter.post(
  "/api/session",
  authenticateHandler("jwt"),
  async (req, res, next) => ExamSessionController.create(req, res, next)
);

examSessionRouter.get(
  "/api/session/:session_id/status",
  authenticateHandler("jwt"),
  async (req, res, next) => ExamSessionController.checkStatus(req, res, next)
);
examSessionRouter.get(
  "/api/session/:session_id/question/:page",
  authenticateHandler("jwt"),
  async (req, res, next) =>
    ExamSessionController.getQuestionOfSession(req, res, next)
);
examSessionRouter.post(
  "/api/session/:session_id/question/:page",
  authenticateHandler("jwt"),
  async (req, res, next) => ExamSessionController.postAnswer(req, res, next)
);
// calculate score of session and set the score in db
examSessionRouter.post(
  "/api/session/:session_id/score",
  async (req, res, next) =>
    ExamSessionController.postScoreOfSession(req, res, next)
);

export default examSessionRouter;
