const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet()); // Middleware to set security-related HTTP headers

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from the same API
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter); // Apply the rate limiting middleware to all routes starting with /api

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Serving static files
app.use(express.static(`${__dirname}/public`)); // Middleware to serve static files from the 'public' directory

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Add a custom property to the request object
  // console.log(req.headers);

  next();
});

// 3) ROUTES
// Mount the routers on the app
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handle all undefined routes (404 Not Found)
app.all("*", (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );
  next(err); // Pass the error to the global error handling middleware
});

app.use(globalErrorHandler);

module.exports = app;
