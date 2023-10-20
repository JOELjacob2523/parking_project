import express from "express";
import CondoAdminQueries from "../controllers/condoAdminQueries.js";

class CondoAdminRoutes {
  constructor() {
    this.router = express.Router();
    this.condoAdminQueries = new CondoAdminQueries();

    this.router.get("/get/condos", this.getCondoByAdminId.bind(this));
    this.router.get(
      "/get/lots/:condoId",
      this.getLotsByCondoIdHandler.bind(this)
    );
    this.router.get("/get/cameras/:lotId", this.getCamerasByLotId.bind(this));
    this.router.get(
      "/get/logs/:condoId",
      this.getLogsByCondoIdHandler.bind(this)
    );
    this.router.get(
      "/get/units/:condoId",
      this.getUnitsByCondoIdHandler.bind(this)
    );
    this.router.get(
      "/get/users/:condoId",
      this.getUsersByCondoIdHandler.bind(this)
    );
    this.router.get("/get/towing/:condoId", this.getTowing.bind(this));
  }

  async getCondoByAdminId(req, res) {
    console.log("getCondoByAdminId", "from condoAdminRoutes.js getCondoByAdminId");
    try {
      const adminId = req.body.adminId ? req.body.adminId : 1; // TODO: remove this line
      let condos = await this.condoAdminQueries.getCondoByAdminId(adminId);
      res.json(condos).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getLotsByCondoIdHandler(req, res) {
    try {
      const lots = await this.condoAdminQueries.getLotsByCondoId(
        req.params.condoId
      );
      res.json(lots).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getCamerasByLotId(req, res) {
    try {
      const cameras = await this.condoAdminQueries.getCamerasByLotId(
        req.params.lotId
      );
      res.json(cameras).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getLogsByCondoIdHandler(req, res) {
    try {
      const archive = req.query.archive;
      const condoId = req.params.condoId;
      if (condoId) {
        if (archive) {
          const logs = await this.condoAdminQueries.getLogsByCondoId(
            condoId,
            archive
          );
          res.json(logs).status(200).end();
        } else {
          const logs = await this.condoAdminQueries.getLogsByCondoId(condoId);
          res.json(logs).status(200).end();
        }
      } else {
        const logs = await this.condoAdminQueries.getAllLogs();
        res.json(logs).status(200).end();
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getUnitsByCondoIdHandler(req, res) {
    try {
      const units = await this.condoAdminQueries.getUnitsByCondoId(
        req.params.condoId
      );
      res.json(units).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getUsersByCondoIdHandler(req, res) {
    try {
      const users = await this.condoAdminQueries.getUsersByCondoId(
        req.params.condoId
      );
      res.json(users).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getTowing(req, res) {
    console.log(req.params, "from condoAdminRoutes.js getTowing")
    try {
      const towing = await this.condoAdminQueries.getTowingDriverByCondoId(
        req.params.condoId
      );
      res.json(towing).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}

export default CondoAdminRoutes;
