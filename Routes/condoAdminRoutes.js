const Router = require("express").Router();
const { getCondoByAdminId } = require("../controllers/condoAdminQueries");

Router.get("/get/condos", async (req, res) => {
  try {
    const adminId = req.body.adminId ? req.body.adminId : 1; // TODO: remove this line
    let condos = await getCondoByAdminId(adminId);
    res.json(condos).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = Router;
