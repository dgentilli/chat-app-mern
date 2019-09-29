const validator = require("validator");
const isEmpty = require("is-empty");

//export the validateRegisterInput function
module.exports = function validateRegisterInput(data) {
  let errors = {};

  //Convert empty fields to a string so validator functions will work
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //Check for empty email field
  if (validator.isEmpty(data.email)) {
    errors.msg = "Email field is required!";
  } else if (!validator.isEmail(data.email)) {
    errors.msg = "Invalid email format!";
  }
  //Password Validation
  if (validator.isEmpty(data.password)) {
    errors.msg = "Password field is required!";
  }
  if (!validator.isLength(data.password, { min: 8, max: 20 })) {
    errors.msg = "Password must be between 8 and 20 characters!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
