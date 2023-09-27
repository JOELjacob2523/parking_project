const express = require("express");
const condoAdminRouter = require("express").Router();
const path = require("path");
const { getCondoByAdminId } = require("../controllers/condoAdminQueries");

const condoAdminBuildPath = path.join(__dirname, "../condo-admin-portal/build");
condoAdminRouter.use("/", express.static(condoAdminBuildPath));

condoAdminRouter.get("/get/condos", async (req, res) => {
  try {
    const adminId = req.body.adminId ? req.body.adminId : 1; // TODO: remove this line
    let condos = await getCondoByAdminId(adminId);
    res.json(condos).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = condoAdminRouter;
