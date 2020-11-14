const logger = require("../../logger");

const NO_ERRORS = null;

function getOperationValidationError({ operation_name, description, category }) {
  if (!operation_name) {
    logger.error(`Invalid operation Name '${operation_name}' supplied`);
    return {
      error: {
        message: `'operation name' must be entered`,
      },
    };
  } else if (!description) {
    logger.error(`Invalid description '${description}' supplied`);
    return {
      error: {
        message: `'description' must be entered`,
      },
    };
  } else if (!category) {
    logger.error(`Invalid category '${category}' supplied`);
    return {
      error: {
        message: `'category' must be entered`,
      },
    };
  }
}

module.exports = {
  getOperationValidationError,
};
