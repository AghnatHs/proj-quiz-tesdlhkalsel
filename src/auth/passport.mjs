import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import AppConfig from "../configs/app.config.mjs";
import UserQuery from "../database/user.query.mjs";

const cookieExtractor = (req) => {
  let jwt = null;
  
  if (req && req.signedCookies) {
    jwt = req.signedCookies.accessToken;

  }

  return jwt;
};

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: AppConfig.JWT.accessTokenSecret,
    },
    (jwtPayload, done) => {
      const { exp } = jwtPayload;

      if (!jwtPayload) done(null, false);

      if (Date.now() > exp * 1000) {
        done(null, false);
      }

      done(null, jwtPayload);
    }
  )
);

passport.use(
  "jwt-admin",
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: AppConfig.JWT.accessTokenSecret,
    },
    async (jwtPayload, done) => {
      try {
        const { exp } = jwtPayload;

        if (!jwtPayload) return done(null, false);

        if (Date.now() > exp * 1000) {
          return done(null, false);
        }

        const user = await UserQuery.getUser(jwtPayload.username);
        if (!user) return done(null, false);
        if (!user.isAdmin) return done(null, false);

        return done(null, jwtPayload);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);