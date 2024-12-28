import { Router } from "express";

import AuthController from "../controllers/auth.controller.mjs";
import authenticateHandler from "../middlewares/auth.middleware.mjs";

const authRouter = Router();

authRouter.get(
  "/api/auth/user",
  authenticateHandler("jwt"),
  async (req, res, next) =>
    res.status(200).json({ success: true, data: "Authenticated" })
);

authRouter.get(
  "/api/auth/admin",
  authenticateHandler("jwt-admin"),
  async (req, res) => {
    res.status(200).json({ success: true, data: "Authenticated admin" });
  }
);

authRouter.post("/api/auth/login", async (req, res, next) =>
  AuthController.login(req, res, next)
);
authRouter.post("/api/auth/refresh", async (req, res, next) =>
  AuthController.refresh(req, res, next)
);
authRouter.post("/api/auth/logout", async (req, res, next) => {
  AuthController.logout(req, res, next);
});

export default authRouter;
