const { createError } = require("./customError");
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      next(
        createError({
          status: error?.status,
          message: error?.message,
          cError: error,
          data: error?.data,
        }),
      );
    });
  };
};
module.exports = asyncHandler;
