import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import passport from "passport";

import AppConfig from "./configs/app.config.mjs";
import errorHandler from "./middlewares/error.middleware.mjs";
import authRouter from "./routes/auth.route.mjs";
import userRouter from "./routes/user.route.mjs";

import "./auth/passport.mjs";

const app = express();
app.use(express.json());
app.use(cookieParser(AppConfig.Cookie.secret));
app.use(passport.initialize());
app.use(authRouter);
app.use(userRouter);
app.use(errorHandler);

export default app;
