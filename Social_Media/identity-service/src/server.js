const express = require("express");
const connectDB = require("./config/connectDB"); // Import the database connection
const helmet = require("helmet"); // Import helmet for security
const cors = require("cors");
const logger = require("./utils/logger");

const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis"); // Import ioredis for Redis connection
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");

const routes = require("./routes/identity-service"); // Import the routes
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3001;
//connect mongodb
connectDB();

const redisClient = new Redis(process.env.REDIS_URL);

//middleware
app.use(express.json()); // Middleware to parse JSON requests
app.use(helmet()); // Use helmet for security
app.use(cors());
app.use((req, res, next) => {
  logger.info(`Request Method: ${req.method}, Request URL: ${req.url}`);
  logger.info(`Request Body,${req.body}`);
  next();
});

//ddos protection and rate limiting

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10, // Number of points to consume per request
  duration: 1, // Duration in seconds
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: "Rate limit exceeded",
      });
    });
});

//ip based rate limiting for sensitive end points
const sensitiveEndPointsLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 50, // Limit each IP to 5 requests per windowMs
  standardHeaders: true, // whether want to include rate limit info in response headers,also client can see no of req left
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

//apply this sensitiveEndPointLimiter to our routes

app.use("/api/auth/register", sensitiveEndPointsLimiter);

//Routes
app.use("/api/auth", routes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`identity-server is running on port ${PORT}`);
});

//unhandled promise rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  // Application specific logging, throwing an error, or other logic here
});
