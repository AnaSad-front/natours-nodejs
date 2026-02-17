class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class constructor with the message

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Mark this error as operational (trusted)

    Error.captureStackTrace(this, this.constructor); // Capture the stack trace for this error
  }
}

module.exports = AppError;
