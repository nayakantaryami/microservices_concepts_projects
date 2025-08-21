require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Redis = require("ioredis");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const logger = require("./utils/logger");
const proxy = require("express-http-proxy");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());

//rate limiting for a given end point
const rateLimiting = rateLimit({
  windowMs: 20 * 60 * 1000, //for 20minute window size
  max: 50, //limit each ip to 50 requests per 20 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`sensitive end point rate limit exceed for ip:${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Rate limit exceeded",
    });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});
app.use(rateLimiting);

app.use((req, res, next) => {
  logger.info(`Request Method: ${req.method}, Request URL: ${req.url}`);
  logger.info(`Request Body: ${req.body}`);
  //using json.stringify(req.body) will expose all the user credentials
  next();
});
const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy error: ${err.message}`);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  },
  useResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(
      `Response received from identity-service: ${proxyRes.statusCode}`
    );
    return proxyResData;
  },
};

//setting up the proxy for identity service
app.use("/v1/auth", proxy(process.env.IDENTITY_SERVICE_URL, proxyOptions));

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API GateWay is running on port ${PORT}`);
  logger.info(
    `Identity Service is running on port ${process.env.IDENTITY_SERVICE_URL}`
  );
  logger.info(`Redis Url ${process.env.REDIS_URL}`);
});
