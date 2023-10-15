import express from "express";
import CondoAdminQueries from "../controllers/condoAdminQueries.js";

class CondoAdminRoutes {
  constructor() {
    this.router = express.Router();
    this.condoAdminQueries = new CondoAdminQueries();

    this.router.get("/get/condos", this.getCondoByAdminId.bind(this));
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
}

export default CondoAdminRoutes;
