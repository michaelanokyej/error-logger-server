const logger = require("../../logger");

const NO_ERRORS = null;

function getPollerValidationError({ poller_name, description }) {
  if (!poller_name) {
    logger.error(`Invalid Poller Name '${poller_name}' supplied`);
    return {
      error: {
        message: `'poller name' must be entered`,
      },
    };
  } else if (!description) {
    logger.error(`Invalid description '${description}' supplied`);
    return {
      error: {
        message: `'description' must be entered`,
      },
    };
  }
}

module.exports = {
  getPollerValidationError,
};
