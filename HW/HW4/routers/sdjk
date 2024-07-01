const { Router } = require("express");
const { prefersController } = require("../controllers/prefersController");
// const vacationData = require("../data/records.json");

const prefersRouter = new Router();

prefersRouter.post("/NewPrefer/:idUser", prefersController.postNewPrefer);
prefersRouter.put("/UpdatePrefer/:idUser", prefersController.putUpdatePrefer);
prefersRouter.get("/ViewAllPrefers", prefersController.getViewAllPrefers);
prefersRouter.get("/SelectedVocation/:idUser", prefersController.getSelectedVocation);

module.exports = { prefersRouter };
