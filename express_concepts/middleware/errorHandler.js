//custom error class

class APIerror extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError"; //set error type to api error
  }
}
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack); //log the error stack
  if (err instanceof APIerror) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message,
    });
  }
  //handle mongoose validation
  else if (err.name === "validationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation Error",
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occured",
    });
  }
};
module.exports = { APIerror, asyncHandler, globalErrorHandler };
