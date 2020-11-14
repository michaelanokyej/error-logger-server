const logger = require("../../logger");

const NO_ERRORS = null;

function getErrorValidationError({ operator_id, error_description, operation_id }) {
  if (!operator_id) {
    logger.error(`Invalid Operator ID '${operator_id}' supplied`);
    return {
      error: {
        message: `'Operator ID' must be entered`,
      },
    };
  } else if (!error_description) {
    logger.error(`Invalid description '${error_description}' supplied`);
    return {
      error: {
        message: `'description' must be entered`,
      },
    };
  } else if (!operation_id) {
    logger.error(`Invalid operation ID '${operation_id}' supplied`);
    return {
      error: {
        message: `'operation ID' must be entered`,
      },
    };
  }
}

module.exports = {
  getErrorValidationError,
};
