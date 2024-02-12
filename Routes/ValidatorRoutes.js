import express from "express";
import ValidatorQueries from "../queries/validatorQueries.js";
class ValidatorRoutes {
  constructor() {
    this.router = express.Router();
    this.ValidatorQueries = new ValidatorQueries();

    this.router.get("/email", this.emailValidator.bind(this));
    this.router.get("/phone", this.phoneValidator.bind(this));
    this.router.get("/camera", this.cameraValidator.bind(this));
    this.router.get(
      "/plateLocked/:plate",
      this.plateLockedValidator.bind(this)
    );

    this.router.get("/get/users/options", this.getUsersForSelect.bind(this));
    this.router.get("/get/condo/options", this.getCondoOptions.bind(this));
  }

  async emailValidator(req, res) {
    try {
      const { email, uptRcId } = req.query;
      const exists = await this.ValidatorQueries.EmailExist(email, uptRcId);
      res.json(exists).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async phoneValidator(req, res) {
    try {
      const { phone, uptRcId } = req.query;
      const exists = await this.ValidatorQueries.PhoneExist(phone, uptRcId);
      res.json(exists).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async cameraValidator(req, res) {
    try {
      const { camId, uptRcId } = req.query;
      const exists = await this.ValidatorQueries.CameraExist(camId, uptRcId);
      res.json(exists).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async plateLockedValidator(req, res) {
    try {
      const plate = req.params.plate;
      const Locked = await this.ValidatorQueries.isCarInLockedLot(plate);
      res.json(Locked).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getUsersForSelect(req, res) {
    try {
      const adminId = req.body.adminId ? req.body.adminId : 1; // TODO: remove this line
      const towing = await this.ValidatorQueries.getUsersIdNameByCondoId(
        adminId
      );
      res.json(towing).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getCondoOptions(req, res) {
    try {
      const adminId = req.body.adminId ? req.body.adminId : 1; // TODO: remove this line
      const condos = await this.ValidatorQueries.getCondoIdAddressByAdminId(
        adminId
      );
      res.json(condos).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}

export default ValidatorRoutes;
