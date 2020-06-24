const logger = require("../../logger");

const NO_ERRORS = null;

function getErrorValidationError({ operator, error_description, poller_id }) {
  if (!operator) {
    logger.error(`Invalid Operator ID '${operator}' supplied`);
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
  } else if (!poller_id) {
    logger.error(`Invalid poller ID '${poller_id}' supplied`);
    return {
      error: {
        message: `'poller ID' must be entered`,
      },
    };
  }
}

module.exports = {
  getErrorValidationError,
};
