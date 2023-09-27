const express = require("express");
const UserRouter = require("express").Router();
const path = require("path");
const {
  getUserProfile,
  getUnitsOfUserWithCondoInfo,
  updateUserProfile,
  updateUnitPlateList,
} = require("../controllers/userQueries");

const userBuildPath = path.join(__dirname, "../user-portal/build");
UserRouter.use("/", express.static(userBuildPath));

UserRouter.get("/get/profile", async (req, res) => {
  try {
    const userId = req.query.userId ? req.query.userId : 1; // TODO: remove this line
    const user = await getUserProfile(userId);
    res.json(user).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

UserRouter.get("/get/units", async (req, res) => {
  try {
    const userId = req.query.userId ? req.query.userId : 1; // TODO: remove this line
    const units = await getUnitsOfUserWithCondoInfo(userId);
    res.json(units).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

UserRouter.put("/update/profile", async (req, res) => {
  try {
    const userId = req.query.userId ? req.query.userId : 1; // TODO: remove this line
    const user = req.body;
    await updateUserProfile(userId, user);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

UserRouter.put("/update/plateList/:unitId", async (req, res) => {
  try {
    const plateList = req.body;
    const unitId = Number(req.params.unitId);
    console.log("type of plateList: ", typeof unitId);
    await updateUnitPlateList(unitId, plateList);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = UserRouter;
