const AppConfig = {
  Server: {
    env: process.env.ENV,
    port: process.env.PORT,
    baseBackendUrl: process.env.BASE_BACKEND_URL,
    baseFrontendUrl: process.env.BASE_FRONTEND_URL,
  },
  Cookie: {
    secret: process.env.COOKIE_SECRET,
  },
  DB: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  JWT: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenMaxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenMaxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
  },
};

export default AppConfig;
