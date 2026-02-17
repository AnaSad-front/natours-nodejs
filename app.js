const express = require("express");
const morgan = require("morgan");

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
  next();
});

// 3) ROUTES
// Mount the routers on the app
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handle all undefined routes (404 Not Found)
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.status = "fail";
  next(err); // Pass the error to the global error handling middleware
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // Set default status code to 500 if not provided
  err.status = err.status || "error"; // Set default status to 'error' if not provided

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
