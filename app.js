const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json()); // Middleware to parse JSON bodies in requests
app.use(express.static(`${__dirname}/public`)); // Middleware to serve static files from the 'public' directory

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
