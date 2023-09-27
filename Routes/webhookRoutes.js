const Routes = require("express").Router();
const webhookHendler  = require("../Utilities/webhookHendler");

Routes.post("/", async (req, res) => {
  try {
    const log = req.body;await webhookHendler(log);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = Routes;
