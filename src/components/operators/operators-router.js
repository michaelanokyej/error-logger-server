const express = require("express");
const xss = require("xss");
const operatorRouter = express.Router();
const bodyParser = express.json();
const logger = require("../../logger");
const operatorService = require("./operators-service");
const { getOperatorValidationError } = require("./operators-validator");

const serializeOperator = operator => ({
  id: operator.id,
  first_name: xss(operator.first_name),
  last_name: xss(operator.last_name),
  username: xss(operator.username),
});

operatorRouter
  .route("/")

  .get((req, res, next) => {
    operatorService
      .getAllOperators(req.app.get("db"))
      .then(operators => {
        res.json(operators.map(serializeOperator));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { first_name, last_name, username } = req.body;
    const newOperator = { first_name, last_name, username };

    for (const field of ["first_name", "last_name", "username"]) {
      if (!newOperator[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getOperatorValidationError(newOperator);

    if (error) return res.status(400).send(error);

    operatorService
      .insertOperator(req.app.get("db"), newOperator)
      .then(operator => {
        logger.info(`operator with id ${operator.id} created.`);
        res.status(201).json(serializeOperator(operator));
      })
      .catch(next);
  });

operatorRouter
  .route("/:operator_id")

  .all((req, res, next) => {
    const { operator_id } = req.params;
    operatorService
      .getById(req.app.get("db"), operator_id)
      .then(operator => {
        if (!operator) {
          logger.error(`operator with id ${operator_id} not found.`);
          return res.status(404).json({
            error: { message: `operator Not Found` }
          });
        }

        res.operator = operator;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializeOperator(res.operator));
  })

  .delete((req, res, next) => {
    const { operator_id } = req.params;
    operatorService
      .deleteoperator(req.app.get("db"), operator_id)
      .then(numRowsAffected => {
        logger.info(`operator with id ${operator_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { operator_name, description, email, password } = req.body;
    const operatorToUpdate = { operator_name, description, email, password };

    const numberOfValues = Object.values(operatorToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'operator_name', 'folder_id', or 'content'`
        }
      });
    }

    const error = getOperatorValidationError(operatorToUpdate);

    if (error) return res.status(400).send(error);

    operatorService
      .updateoperator(req.app.get("db"), req.params.operator_id, operatorToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = operatorRouter;
