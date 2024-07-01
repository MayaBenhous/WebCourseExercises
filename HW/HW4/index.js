require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const { usersRouter } = require("./routers/usersRouter.js");
const { prefersRouter } = require("./routers/prefersRouter.js");

