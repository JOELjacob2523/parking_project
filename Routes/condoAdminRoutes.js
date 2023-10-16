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
    this.router.get(
      "/get/logs/:condoId",
      this.getLotByCondoIdHandler.bind(this)
    );
    this.router.get(
      "/get/units/:condoId",
      this.getUnitsByCondoIdHandler.bind(this)
    );
  }

  async getCondoByAdminId(req, res) {
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

  async getLotByCondoIdHandler(req, res) {
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
}

export default CondoAdminRoutes;
