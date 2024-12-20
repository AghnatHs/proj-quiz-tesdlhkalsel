import AppConfig from "../configs/app.config.mjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const TokenService = {
  generateAccessToken: (credentials) => {
    return jwt.sign(
      {
        ...credentials,
        unique: uuidv4(),
        exp: Math.floor(Date.now() / 1000) + AppConfig.JWT.accessTokenMaxAge,
      },
      AppConfig.JWT.accessTokenSecret
    );
  },
  generateRefreshToken: (credentials) => {
    return jwt.sign(
      {
        ...credentials,
        unique: uuidv4(),
        exp: Math.floor(Date.now() / 1000) + AppConfig.JWT.refreshTokenMaxAge,
      },
      AppConfig.JWT.refreshTokenSecret
    );
  },
  verifyToken: (token, secret) => jwt.verify(token, secret),
};

export default TokenService;
