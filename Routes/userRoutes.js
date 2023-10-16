import express from "express";
import UserQueries from "../controllers/userQueries.js";

class UserRoutes {
  constructor() {
    this.router = express.Router();
    this.userQueries = new UserQueries();
    this.router.get("/get/profile", this.#getUserProfile.bind(this));
    this.router.get("/get/units", this.#getUnitsOfUser.bind(this));
    this.router.get(
      "/get/units/cars/:unitId",
      this.#getUnitAddressCarListAndMaxCars.bind(this)
    );
    this.router.put("/update/profile", this.#updateUserProfile.bind(this));
    this.router.put(
      "/update/plateList/:unitId",
      this.#updateUnitPlateList.bind(this)
    );
  }

  async #getUserProfile(req, res) {
    try {
      const userId = req.query.userId ? req.query.userId : 1; // TODO: remove this line
      const user = await this.userQueries.getUserProfile(userId);
      res.json(user).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async #getUnitsOfUser(req, res) {
    try {
      const userId = req.params.unitId ? req.params.unitId : 1; // TODO: remove this line

      const units = await this.userQueries.getUnitsOfUser(userId);
      res.json(units).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async #getUnitAddressCarListAndMaxCars(req, res) {
    try {
      const { unitId } = req.params;
      const units = await this.userQueries.getUnitAddressCarListAndMaxCars(
        unitId
      );
      res.json(units).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async #updateUserProfile(req, res) {
    try {
      const userId = req.query.userId ? req.query.userId : 1; // TODO: remove this line
      const user = req.body;
      await this.userQueries.updateUserProfile(userId, user);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async #updateUnitPlateList(req, res) {
    console.log("update plate list");
    try {
      const plateList = req.body;
      console.log(plateList, "from userRoutes.js");
      const unitId = Number(req.params.unitId);
      await this.userQueries.updateUnitPlateList(unitId, plateList);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}

export default UserRoutes;
