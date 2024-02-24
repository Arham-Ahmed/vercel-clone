const customSuccess = ({ status = 200, message, data }) => {
  return { status, success: true, message, data };
};

const createSuccess = ({ status, message, data }) => {
  return customSuccess({ status, message, data });
};

const ok = ({ message = "OK", data }) => {
  return customSuccess({ status: 200, message, data });
};

const created = ({ message = "Created", data }) => {
  return customSuccess({ status: 201, message, data });
};

const accepted = ({ message = "Accepted", data }) => {
  return customSuccess({ status: 202, message, data });
};

const noContent = ({ message = "No content", data }) => {
  return customSuccess({ status: 204, message, data });
};

module.exports = { customSuccess, createSuccess, ok, created, accepted, noContent };
