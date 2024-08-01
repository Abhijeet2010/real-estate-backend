export const ApiError = (res, statusCode, error, message) => {
  return res.status(statusCode).json({
    status: "error",
    error: error.message || error,
    message,
  });
};
