module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // Set default status code to 500 if not provided
  err.status = err.status || "error"; // Set default status to 'error' if not provided

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
