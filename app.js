const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES
app.use(morgan("dev")); // Middleware for logging HTTP requests in development mode
app.use(express.json()); // Middleware to parse JSON bodies in requests

app.use(express.static(`${__dirname}/public`)); // Middleware to serve static files from the 'public' directory

app.use((req, res, next) => {
  console.log("Hello from the Middleware 👋");
  next(); // Call the next middleware in the stack
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Add a custom property to the request object
  next();
});

// 3) ROUTES
// Mount the routers on the app
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
