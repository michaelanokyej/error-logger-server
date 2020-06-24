const express = require("express");
const xss = require("xss");
const pollerRouter = express.Router();
const bodyParser = express.json();
const logger = require("../../logger");
const pollerService = require("./pollers-service");
const { getPollerValidationError } = require("./pollers-validator");

const serializePoller = poller => ({
  id: poller.id,
  poller_name: xss(poller.poller_name),
  description: xss(poller.description),
  poller_errors: poller.poller_errors
});

pollerRouter
  .route("/")

  .get((req, res, next) => {
    pollerService
      .getAllPollers(req.app.get("db"))
      .then(pollers => {
        res.json(pollers.map(serializePoller));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { poller_name, description } = req.body;
    const newPoller = { poller_name, description };

    for (const field of ["poller_name", "description"]) {
      if (!newPoller[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = getPollerValidationError(newPoller);

    if (error) return res.status(400).send(error);

    pollerService
      .insertPoller(req.app.get("db"), newPoller)
      .then(poller => {
        logger.info(`poller with id ${poller.id} created.`);
        res.status(201).json(serializePoller(poller));
      })
      .catch(next);
  });

pollerRouter
  .route("/:poller_id")

  .all((req, res, next) => {
    const { poller_id } = req.params;
    pollerService
      .getById(req.app.get("db"), poller_id)
      .then(poller => {
        if (!poller) {
          logger.error(`poller with id ${poller_id} not found.`);
          return res.status(404).json({
            error: { message: `poller Not Found` }
          });
        }

        res.poller = poller;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializePoller(res.poller));
  })

  .delete((req, res, next) => {
    const { poller_id } = req.params;
    pollerService
      .deletePoller(req.app.get("db"), poller_id)
      .then(numRowsAffected => {
        logger.info(`poller with id ${poller_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { poller_name, description, email, password } = req.body;
    const pollerToUpdate = { poller_name, description, email, password };

    const numberOfValues = Object.values(pollerToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'poller_name', 'folder_id', or 'content'`
        }
      });
    }

    const error = getPollerValidationError(pollerToUpdate);

    if (error) return res.status(400).send(error);

    pollerService
      .updatepoller(req.app.get("db"), req.params.poller_id, pollerToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = pollerRouter;
