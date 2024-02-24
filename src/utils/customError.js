const customError = ({ status = 500, message = "Internal server error", data, cError }) => {
  let error = new Error();
  error.status = status;
  error.success = false;
  error.message = message;
  error.data = data;
  error.stack = cError?.stack !== undefined ? cError?.stack + error?.stack : error?.stack;
  return error;
};
const createError = ({ status, message = "An error on creating this", data, cError }) => {
  return customError({ status, message, data, cError });
};
const notFound = ({ message = "Not found", data, cError }) => {
  return customError({ status: 404, message, data, cError });
};
const badRequest = ({ message = "Bad request", data, cError }) => {
  return customError({ status: 400, message, data, cError });
};
const unAuthorized = ({ message = "Un authorized", data, cError }) => {
  return customError({ status: 401, message, data, cError });
};
const paymentRequired = ({ message = "Payment required", data, cError }) => {
  return customError({ status: 402, message, data, cError });
};
const validationError = ({ message = "Validation error", data, cError }) => {
  return customError({ status: 403, message, data, cError });
};
const forbidden = ({ message = "Forbidden", data, cError }) => {
  return customError({ status: 403, message, data, cError });
};
const internal = ({ message = "Internal server error", data, cError }) => {
  return customError({ status: 500, message, data, cError });
};
const notAcceptAble = ({ message = "Not acceptable", data, cError }) => {
  return customError({ status: 406, message, data, cError });
};
const conflict = ({ message = "Conflict ", data, cError }) => {
  return customError({ status: 409, message, data, cError });
};
const unSupportedMedia = ({ message = "Un supported media file", data, cError }) => {
  return customError({ status: 415, message, data, cError });
};
const dataWithError = ({ status = 500, message = "data, with error", data, cError }) => {
  return customError({ status, message, data, cError });
};

module.exports = {
  customError,
  createError,
  notFound,
  badRequest,
  unAuthorized,
  paymentRequired,
  validationError,
  forbidden,
  internal,
  notAcceptAble,
  conflict,
  unSupportedMedia,
  dataWithError,
};
