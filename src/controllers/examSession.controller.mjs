import ExamSessionService from "../services/examSession.service.mjs";

const ExamSessionController = {
  changeExamPassword: async (req, res, next) => {
    try {
      const result = await ExamSessionService.changeExamPassword(req);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
  checkStatus: async (req, res, next) => {
    try {
      const result = await ExamSessionService.checkStatus(req);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const result = await ExamSessionService.create(req);
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
  getQuestionOfSession: async (req, res, next) => {
    try {
      const result = await ExamSessionService.getQuestionOfSession(req);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
  finishSession: async (req, res, next) => {
    try {
      const result = await ExamSessionService.finishSession(req);
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
  postAnswer: async (req, res, next) => {
    try {
      const result = await ExamSessionService.postAnswer(req);
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};

export default ExamSessionController;
