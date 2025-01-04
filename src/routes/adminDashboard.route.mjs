import { Router } from "express";

import AdminDashboardController from "../controllers/adminDashboard.controller.mjs";
import authenticateHandler from "../middlewares/auth.middleware.mjs";

const adminDashboardRouter = Router();

adminDashboardRouter.get(
  "/api/admin/sessions",
  authenticateHandler("jwt-admin"),
  async (req, res, next) =>
    AdminDashboardController.getOrRefreshSessions(req, res, next)
);

adminDashboardRouter.get(
  "/api/admin/question",
  authenticateHandler("jwt-admin"),
  async (req, res, next) =>
    AdminDashboardController.getAllQuestions(req, res, next)
);

adminDashboardRouter.post(
  "/api/admin/question",
  authenticateHandler("jwt-admin"),
  async (req, res, next) =>
    AdminDashboardController.createNewQuestion(req, res, next)
);

adminDashboardRouter.delete(
  "/api/admin/question/:id",
  authenticateHandler("jwt-admin"),
  async (req, res, next) =>
    AdminDashboardController.deleteQuestionById(req, res, next)
);

export default adminDashboardRouter;
