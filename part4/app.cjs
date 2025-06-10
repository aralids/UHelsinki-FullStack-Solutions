const express = require("express");
const mongoose = require("mongoose");

const config = require("./utils/config.cjs");
const middleware = require("./utils/middleware.cjs");
const blogsRouter = require("./controllers/blogs.cjs");
const usersRouter = require("./controllers/users.cjs");
const loginRouter = require("./controllers/login.cjs");

mongoose.connect(config.MONGODB_URI);

const app = express();
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
