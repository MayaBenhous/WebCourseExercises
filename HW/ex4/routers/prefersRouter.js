const { Router } = require("express");
const { prefersController } = require("../controllers/prefersController");
const vacationData = require("../data/records.json");

const prefersRouter = new Router();

prefersRouter.post("/NewPrefer", prefersController.postNewPrefer);
prefersRouter.put("/UpdatePrefer/:idPrefer", prefersController.putUpdatePrefer);
prefersRouter.get("/ViewAllPrefers", prefersController.getViewAllPrefers);

module.exports = { prefersRouter };
