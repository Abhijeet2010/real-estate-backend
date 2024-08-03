export const ApiError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "error",
    message: message,
  });
};
