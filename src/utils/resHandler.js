const filterError = require("./filterError");
const fs = require("fs");
const path = require("path");

const resHandle = (error, req, res, next) => {
  //**  This condition delete image if it exist in request
  if (error?.success === false && req?.file) {
    const imgPath = req?.file?.filename;
    fs?.unlinkSync(path?.join(`public/tmp/uploads/${imgPath}`));
  }
  let statusCode = error.status || 500;
  // checking for environment
  if (process.env.NODE_ENV?.trim() === "development") {
    data = {
      success: error?.success,
      message: filterError(error?.message)?.toString()?.replaceAll(",", " "),
      data: error?.data,
      errorStackTrace: filterError(error?.stack),
    };
  } else if (process.env.NODE_ENV?.trim() === "production") {
    data = {
      success: error?.success,
      message: filterError(error?.message)?.toString()?.replaceAll(",", " "),
      data: error?.data,
    };
  } else {
    data = {
      success: error?.success,
      ENV_MESSAGE: "Please set an environment variable",
      message: filterError(error?.message),
      data: error?.data,
    };
  }
  // handling reference error
  if (error instanceof ReferenceError) {
    statusCode = error?.status || 500;
    data.message = "A reference error occurred.";
    data.success = false;
  }
  if (error?.success) {
    data = {
      success: error?.success,
      message: error?.message,
      data: error?.data,
    };
  }
  return res?.status(statusCode)?.json(data);
};

module.exports = resHandle;
