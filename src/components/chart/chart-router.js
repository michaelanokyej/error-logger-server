const express = require("express");
const xss = require("xss");
const chartRouter = express.Router();
const bodyParser = express.json();
const logger = require("../../logger");
const operationsService = require("../operations/operations-service");

const serializeOperation = (operation) => ({
  operation_id: operation.operation_id,
  operation_name: xss(operation.operation_name),
  description: xss(operation.description),
  operation_errors: parseInt(operation.operation_errors),
});

chartRouter
  .route("/")

  .get((req, res, next) => {
    operationsService
      .getAllOperationsAndErrors(req.app.get("db"))
      .then((operations) => {
        res.json(operations.map(serializeOperation));
      })
      .catch(next);
  });
//   .post(bodyParser, (req, res, next) => {
//     const { operation_name, description } = req.body;
//     const newoperation = { operation_name, description };

//     for (const field of ["operation_name", "description"]) {
//       if (!newoperation[field]) {
//         logger.error(`${field} is required`);
//         return res.status(400).send({
//           error: { message: `'${field}' is required` }
//         });
//       }
//     }

//     const error = getoperationValidationError(newoperation);

//     if (error) return res.status(400).send(error);

//     operationService
//       .insertoperation(req.app.get("db"), newoperation)
//       .then(operation => {
//         logger.info(`operation with id ${operation.id} created.`);
//         res.status(201).json(serializeoperation(operation));
//       })
//       .catch(next);
//   });

// chartRouter
//   .route("/:operation_id")

//   .all((req, res, next) => {
//     const { operation_id } = req.params;
//     operationService
//       .getById(req.app.get("db"), operation_id)
//       .then(operation => {
//         if (!operation) {
//           logger.error(`operation with id ${operation_id} not found.`);
//           return res.status(404).json({
//             error: { message: `operation Not Found` }
//           });
//         }

//         res.operation = operation;
//         next();
//       })
//       .catch(next);
//   })

//   .get((req, res) => {
//     res.json(serializeoperation(res.operation));
//   })

//   .delete((req, res, next) => {
//     const { operation_id } = req.params;
//     operationService
//       .deleteoperation(req.app.get("db"), operation_id)
//       .then(numRowsAffected => {
//         logger.info(`operation with id ${operation_id} deleted.`);
//         res.status(204).end();
//       })
//       .catch(next);
//   })

//   .patch(bodyParser, (req, res, next) => {
//     const { operation_name, description, email, password } = req.body;
//     const operationToUpdate = { operation_name, description, email, password };

//     const numberOfValues = Object.values(operationToUpdate).filter(Boolean).length;
//     if (numberOfValues === 0) {
//       logger.error(`Invalid update without required fields`);
//       return res.status(400).json({
//         error: {
//           message: `Request body must content either 'operation_name', 'folder_id', or 'content'`
//         }
//       });
//     }

//     const error = getoperationValidationError(operationToUpdate);

//     if (error) return res.status(400).send(error);

//     operationService
//       .updateoperation(req.app.get("db"), req.params.operation_id, operationToUpdate)
//       .then(numRowsAffected => {
//         res.status(204).end();
//       })
//       .catch(next);
//   });

module.exports = chartRouter;
