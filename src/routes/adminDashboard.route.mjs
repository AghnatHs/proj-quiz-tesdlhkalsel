import { Router } from "express";
import passport from "passport";
import AdminDashboardController from "../controllers/adminDashboard.controller.mjs";

const adminDashboardRouter = Router();

adminDashboardRouter.get(
  "/api/admin/sessions",
  passport.authenticate("jwt-admin", { session: false }),
  async (req, res, next) =>
    AdminDashboardController.getOrRefreshSessions(req, res, next)
);

export default adminDashboardRouter;
