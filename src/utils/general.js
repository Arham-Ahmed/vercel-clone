const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { isValidObjectId, default: mongoose } = require("mongoose");
const { validationError, badRequest } = require("./customError");

//** hashPassword it hash password using bcryptjs
const hashPassword = (password) => {
  return bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));
};

//** jwtGenerator it generate JsonWebToken's
const jwtGenerator = (user) => {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//** jwtVerifier it verify JsonWebToken's
const jwtVerifier = (dbToken, type) => {
  return jwt.verify(dbToken, process.env.JWT_SECRET, (error, decode) => {
    if (error) {
      throw badRequest({ message: `Your provide ${type} is expired` });
    } else {
      return decode;
    }
  });
};

//** idValidator it verify mongoose id.  if you don't need to get error just do error : false
const idValidator = ({ value, type, error = true }) => {
  if (!isValidObjectId(value) && error) {
    throw validationError({ message: `invalid ${type} id` });
  } else if (!isValidObjectId(value)) {
    return "error";
  }
};

//** dbExistencesChecker it return document or error. if you don't need to get error just do error : false
const dbExistencesChecker = async ({
  value,
  model,
  findMethod = "_id",
  extra,
  error = true,
  errorMessage,
  status = true,
  select = "",
}) => {
  //** making 1 letter UpperCase to find model * && * in some case model should be LocationId == Location -- Id
  const modelName = model?.charAt(0).toUpperCase() + model?.slice(1); //** for future purpose */ ?.split("Id")[0];

  //**  Constructing the query
  const query = {
    [findMethod]: findMethod === "_id" ? new mongoose.Types.ObjectId(value) : value,
    isDeleted: null,
    ...(status && { status: "active" }),
    ...extra,
  };

  let document = await mongoose
    .model(modelName)
    .findOne(query)
    .select([...select]);
  if (!document && error) {
    throw validationError({
      message: errorMessage || `${modelName} not found`,
    });
  } else {
    return document !== null ? document : "error";
  }
};

//** roleChecker it checks the roles
const roleChecker = (allowedRoles, roles) => {
  roles?.forEach((role) => {
    if (allowedRoles?.indexOf(role) === -1) {
      throw validationError({ message: `You are unauthorized to perform this action` });
    }
  });
};

//** reqPropertyAssign it assign the property in req.body
const reqPropertyAssign = (source, property, req) => {
  if (req?.body?.[property]) {
    // property?.split("Id")[0]. this is for userId to ==> user
    idValidator({ value: req?.body?.[property], type: property?.split("Id")[0] });
  }
  req.body[property] = req?.body?.[property]
    ? req?.body?.[property]
    : source?.[property]?.toString();
};

//** generateOtp  its generate 6 digit long Otp
const generateOtp = () => {
  let otp = Math.floor(100000 + Math.random() * 900000); // for live mode
  let otpExpTime = jwt.sign({ otp }, process.env.JWT_SECRET, { expiresIn: "5m" });
  return {
    otp,
    otpExpTime,
  };
};

//** time format

const formatTime = (value) => {
  let hour = Math.floor(moment.duration(value, "seconds").asHours());
  let min = Math.floor(moment.duration(value, "seconds").minutes());
  let sec = Math.floor(moment.duration(value, "seconds").seconds());

  return `${hour > 9 ? hour : `0${hour}`}:${min > 9 ? min : `0${min}`}:${
    sec > 9 ? sec : `0${sec}`
  }`;
};

module.exports = {
  hashPassword,
  jwtGenerator,
  jwtVerifier,
  idValidator,
  dbExistencesChecker,
  roleChecker,
  reqPropertyAssign,
  generateOtp,
  formatTime,
};
