const validator = require("validator");
const isEmpty = require("is-empty");

//export the validateRegisterInput function
module.exports = function validateLoginInput(data) {
  let errors = {};

  //Convert empty fields to a string so validator functions will work
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //Check for empty email field
  if (validator.isEmpty(data.email)) {
    errors.msg = "Email field is required!";
  } else if (!validator.isEmail(data.email)) {
    //errors.email = "Invalid email format!";
    errors.msg = "Invalid email format!";
  }
  //Password Validation
  if (validator.isEmpty(data.password)) {
    errors.msg = "Password field is required!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
