import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import passport from "passport";

import AppConfig from "./configs/app.config.mjs";
import errorHandler from "./middlewares/error.middleware.mjs";
import adminDashboardRouter from "./routes/adminDashboard.route.mjs";
import authRouter from "./routes/auth.route.mjs";
import examSessionRouter from "./routes/examSession.route.mjs";
import userRouter from "./routes/user.route.mjs";

import "./auth/passport.mjs";

const app = express();
app.use(express.json());
const corsOptions = {
  origin: AppConfig.Server.baseFrontendUrl,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser(AppConfig.Cookie.secret));
app.use(passport.initialize());
app.use(adminDashboardRouter);
app.use(authRouter);
app.use(userRouter);
app.use(examSessionRouter);
app.use(errorHandler);

export default app;
