import { rateLimit } from "express-rate-limit";

function rateLimiter(limit, windowMinute) {
  return rateLimit({
    windowMs: windowMinute * 60 * 1000,
    limit: limit,
    standardHeaders: true,
    legacyHeaders: false,
  });
}
export default rateLimiter;
