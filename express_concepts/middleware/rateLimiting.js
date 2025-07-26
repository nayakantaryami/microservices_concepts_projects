const rateLimit = require("express-rate-limit");
const createBasicRateLimiter = (maxRequests, time) => {
  return rateLimit({
    max: maxRequests, //maximum no of requests can be
    windowMs: time, //in this period of time,
    message: "Too many requests,please try again later",
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports={createBasicRateLimiter}
