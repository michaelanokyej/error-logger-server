const express = require("express");
const path = require("path");
const xss = require("xss");
const errorsRouter = express.Router();
const bodyParser = express.json();
const logger = require("../../logger");
const errorService = require("./error-service");
const { getErrorValidationError } = require("./error-validator");
const jwt = require("jsonwebtoken");

const serializeError = (error) => ({
  error_id: error.error_id,
  operator_id: error.operator_id,
  is_fixed: error.is_fixed,
  error_description: xss(error.error_description),
  operation_id: error.operation_id,
  operation_name: xss(error.operation_name),
  category: xss(error.category),
  posted: xss(error.posted),
});

errorsRouter
  .route("/")

  .get((req, res, next) => {
    errorService
      // .getAllErrors(req.app.get("db"))
      .getAllErrorsAndOperations(req.app.get("db"))
      .then((errors) => {
        res.json(errors.map(serializeError));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { operator_id, error_description, operation_id } = req.body;
    const newError = { operator_id, error_description, operation_id };

    for (const field of ["operator_id", "error_description", "operation_id"]) {
      if (!newError[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` },
        });
      }
    }

    const operationError = getErrorValidationError(newError);

    if (operationError) return res.status(400).send(operationError);

    errorService
      .insertError(req.app.get("db"), newError)
      .then((error) => {
        logger.info(`error with id ${error.id} created.`);
        res.status(201).json(serializeError(error));
      })
      .catch(next);
  });

errorsRouter
  .route("/:error_id")

  .all((req, res, next) => {
    const { error_id } = req.params;
    errorService
      .getById(req.app.get("db"), error_id)
      .then((error) => {
        if (!error) {
          logger.error(`error with id ${error_id} not found.`);
          return res.status(404).json({
            error: { message: `error Not Found` },
          });
        }

        res.error = error;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializeError(res.error));
  })

  .delete((req, res, next) => {
    const { error_id } = req.params;
    errorService
      .deleteError(req.app.get("db"), error_id)
      .then((numRowsAffected) => {
        logger.info(`error with id ${error_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { is_fixed } = req.body;
    const errorToUpdate = { is_fixed };

    const numberOfValues = Object.values(errorToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'error id'`,
        },
      });
    }

    // const operationError = getErrorValidationError(errorToUpdate);

    // if (operationError) return res.status(400).send(operationError);

    errorService
      .updateError(req.app.get("db"), req.params.error_id, errorToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = errorsRouter;
