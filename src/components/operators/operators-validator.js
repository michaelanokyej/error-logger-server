const logger = require("../../logger");

const NO_ERRORS = null;

function getOperatorValidationError({ first_name, last_name, username }) {
  if (!first_name) {
    logger.error(`Invalid Operator First Name '${first_name}' supplied`);
    return {
      error: {
        message: `'Operator first name' must be entered`,
      }
    };
  }
  else if (!last_name) {
    logger.error(`Invalid Operator Last Name '${last_name}' supplied`);
    return {
      error: {
        message: `'Operator last name' must be entered`,
      }
    };
  }
  if (!username) {
    logger.error(`Invalid Operator User Name '${username}' supplied`);
    return {
      error: {
        message: `'Operator username' must be entered`,
      }
    };
  }
}

module.exports = {
  getOperatorValidationError,
};
