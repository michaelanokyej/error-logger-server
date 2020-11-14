const express = require("express");
const xss = require("xss");
const operationsRouter = express.Router();
const bodyParser = express.json();
const logger = require("../../logger");
const operationsService = require("./operations-service");
const { getOperationValidationError } = require("./operations-validator");

const serializeOperation = (operation) => ({
  id: operation.id,
  operation_name: xss(operation.operation_name),
  description: xss(operation.description),
  category: operation.category,
  operation_errors: operation.operation_errors,
});

operationsRouter
  .route("/")

  .get((req, res, next) => {
    operationsService
      .getAllOperations(req.app.get("db"))
      .then((operations) => {
        res.json(operations.map(serializeOperation));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { operation_name, description, category } = req.body;
    const newOperation = { operation_name, description, category };

    for (const field of ["operation_name", "description", "category"]) {
      if (!newOperation[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` },
        });
      }
    }

    const error = getOperationValidationError(newOperation);

    if (error) return res.status(400).send(error);

    operationsService
      .insertOperation(req.app.get("db"), newOperation)
      .then((operation) => {
        logger.info(`operation with id ${operation.id} created.`);
        res.status(201).json(serializeOperation(operation));
      })
      .catch(next);
  });

operationsRouter
  .route("/:operation_id")

  .all((req, res, next) => {
    const { operation_id } = req.params;
    operationsService
      .getById(req.app.get("db"), operation_id)
      .then((operation) => {
        if (!operation) {
          logger.error(`operation with id ${operation_id} not found.`);
          return res.status(404).json({
            error: { message: `operation Not Found` },
          });
        }

        res.operation = operation;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializeOperation(res.operation));
  })

  .delete((req, res, next) => {
    const { operation_id } = req.params;
    operationsService
      .deleteOperation(req.app.get("db"), operation_id)
      .then((numRowsAffected) => {
        logger.info(`operation with id ${operation_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { operation_name, description, category } = req.body;
    const operationToUpdate = { operation_name, description, category };

    const numberOfValues = Object.values(operationToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'operation_name', 'fdescription', and 'category'`,
        },
      });
    }

    const error = serializeOperation(operationToUpdate);

    if (error) return res.status(400).send(error);

    operationsService
      .updateOperation(
        req.app.get("db"),
        req.params.operation_id,
        operationToUpdate
      )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = operationsRouter;
