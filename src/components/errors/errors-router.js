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
  id: error.id,
  operator: xss(error.operator),
  error_description: xss(error.error_description),
  poller_id: error.poller_id,
  posted: xss(error.posted),
});

errorsRouter
  .route("/")

  .get((req, res, next) => {
    errorService
      .getAllErrors(req.app.get("db"))
      .then((errors) => {
        res.json(errors.map(serializeError));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { operator, error_description, poller_id } = req.body;
    const newError = { operator, error_description, poller_id };

    for (const field of ["operator", "error_description", "poller_id"]) {
      if (!newError[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` },
        });
      }
    }

    const pollerError = getErrorValidationError(newError);

    if (pollerError) return res.status(400).send(pollerError);

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
    const { error, userid } = req.body;
    const errorToUpdate = { error, userid };

    const numberOfValues = Object.values(errorToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'userid'or 'error'`,
        },
      });
    }

    const pollerError = getErrorValidationError(errorToUpdate);

    if (pollerError) return res.status(400).send(pollerError);

    errorService
      .updateError(req.app.get("db"), req.params.error_id, errorToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = errorsRouter;
