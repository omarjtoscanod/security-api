const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const api = require("./api/v1");

const app = express();

// cors
app.use(
  cors({
    origin: "*",
  })
);

// Add unique ID to every request
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// parse application/json
app.use(express.json());

app.use("/api/v1", api);

app.use((req, res, next) => {
  next({
    message: "Route Not Found",
    statusCode: 404,
  });
});

app.use((err, req, res, next) => {
  const { message = "", statusCode = 500 } = err;

  res.status(statusCode);
  res.json({
    message,
  });
});

module.exports = app;
