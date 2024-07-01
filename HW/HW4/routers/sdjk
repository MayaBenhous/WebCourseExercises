const { Router } = require("express");
const { usersController } = require("../controllers/usersController.js");
const usersRouter = new Router();

usersRouter.post("/register", usersController.postNewUser);

module.exports = { usersRouter };
