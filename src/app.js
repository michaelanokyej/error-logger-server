require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const errorHandler = require("./error-handler");
const pollersRouter = require("./components/pollers/pollers-router");
const operatorsRouter = require("./components/operators/operators-router");
const errorsRouter = require("./components/errors/errors-router");
const chartRouter = require("./components/chart/chart-router");



const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test"
  })
);

app.use(helmet());
app.use(cors());

app.use("/api/chart", chartRouter)
app.use("/api/pollers", pollersRouter)
app.use("/api/operators", operatorsRouter)
app.use("/api/errors", errorsRouter)


app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(errorHandler);


module.exports = app;
