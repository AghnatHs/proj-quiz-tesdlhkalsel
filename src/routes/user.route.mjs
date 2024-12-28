import { Router } from "express";

import UserController from "../controllers/user.controller.mjs";
import authenticateHandler from "../middlewares/auth.middleware.mjs";

const userRouter = Router();

userRouter.get(
  "/api/user",
  authenticateHandler("jwt"),
  async (req, res, next) => UserController.get(req, res, next)
);
userRouter.post("/api/users", async (req, res, next) =>
  UserController.register(req, res, next)
);

export default userRouter;
