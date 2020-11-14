const express = require("express");
const xss = require("xss");
const taskRouter = express.Router();
const bodyParser = express.json();
const logger = require("../../logger");
const taskService = require("./tasks-service");
const { gettaskValidationError } = require("./tasks-validator");

const serializetask = task => ({
  id: task.id,
  task_name: xss(task.task_name),
  description: xss(task.description),
  task_errors: task.task_errors
});

taskRouter
  .route("/")

  .get((req, res, next) => {
    taskService
      .getAllTasks(req.app.get("db"))
      .then(tasks => {
        res.json(tasks.map(serializetask));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { task_name, description } = req.body;
    const newtask = { task_name, description };

    for (const field of ["task_name", "description"]) {
      if (!newtask[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        });
      }
    }

    const error = gettaskValidationError(newtask);

    if (error) return res.status(400).send(error);

    taskService
      .inserttask(req.app.get("db"), newtask)
      .then(task => {
        logger.info(`task with id ${task.id} created.`);
        res.status(201).json(serializetask(task));
      })
      .catch(next);
  });

taskRouter
  .route("/:task_id")

  .all((req, res, next) => {
    const { task_id } = req.params;
    taskService
      .getById(req.app.get("db"), task_id)
      .then(task => {
        if (!task) {
          logger.error(`task with id ${task_id} not found.`);
          return res.status(404).json({
            error: { message: `task Not Found` }
          });
        }

        res.task = task;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializetask(res.task));
  })

  .delete((req, res, next) => {
    const { task_id } = req.params;
    taskService
      .deletetask(req.app.get("db"), task_id)
      .then(numRowsAffected => {
        logger.info(`task with id ${task_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { task_name, description, email, password } = req.body;
    const taskToUpdate = { task_name, description, email, password };

    const numberOfValues = Object.values(taskToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'task_name', 'folder_id', or 'content'`
        }
      });
    }

    const error = gettaskValidationError(taskToUpdate);

    if (error) return res.status(400).send(error);

    taskService
      .updatetask(req.app.get("db"), req.params.task_id, taskToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = taskRouter;
