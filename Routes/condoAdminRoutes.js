import express from "express";
import CondoAdminQueries from "../queries/condoAdminQueries.js";

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

    this.router.get("/get/logs/:lotId", this.getLogsByLotIdHandler.bind(this));
    this.router.get(
      "/get/log/img/:logId",
      this.getImgByLogIdHandler.bind(this)
    );
    this.router.get(
      "/get/units/:condoId",
      this.getUnitsByCondoIdHandler.bind(this)
    );
    this.router.get(
      "/get/users/:condoId",
      this.getUsersByCondoIdHandler.bind(this)
    );
    this.router.get("/get/towing", this.getTowing.bind(this));

    this.router.get("/get/condo/options", this.getCondoOptions.bind(this));

    this.router.put("/update/lot/:lotId", this.updateLotHandler.bind(this));

    this.router.put(
      "/update/camera/:cameraId",
      this.updateCameraHandler.bind(this)
    );

    this.router.put(
      "/update/condo/:condoId",
      this.updateCondoHandler.bind(this)
    );

    this.router.put("/update/user/:userId", this.updateUserHandler.bind(this));

    this.router.put("/update/unit/:unitId", this.updateUnitHandler.bind(this));

    this.router.post("/create/condo", this.createCondoHandler.bind(this));
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

  async getLogsByLotIdHandler(req, res) {
    try {
      const lotId = req.params.lotId;
      const logs = await this.condoAdminQueries.getNotAllowedLogsByLotId(lotId);
      res.json(logs).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getImgByLogIdHandler(req, res) {
    console.log(req.params.logId);
    try {
      const logId = req.params.logId;
      const imageData = await this.condoAdminQueries.getCarImageForLog(logId);
      const base64Image = Buffer.from(imageData[0].vehicle_pic);

      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Length", imageData.length);
      res.send(base64Image);
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
      console.log(units);
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
    try {
      const adminId = req.body.adminId ? req.body.adminId : 1; // TODO: remove this line
      const towing = await this.condoAdminQueries.getUsersIdNameByCondoId(
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
      const condos = await this.condoAdminQueries.getCondoIdAddressByAdminId(
        adminId
      );
      res.json(condos).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async updateLotHandler(req, res) {
    try {
      const lotId = req.params.lotId;
      const lot = req.body;
      const result = await this.condoAdminQueries.updateLotById(lotId, lot);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async updateCondoHandler(req, res) {
    try {
      const condoId = req.params.condoId;
      const condo = req.body;
      const result = await this.condoAdminQueries.updateCondoById(
        condoId,
        condo
      );
      res.json(result).status(200);
    } catch (error) {
      if (error.code == "ER_DUP_ENTRY") {
        res.status(409).json({ error: error.code });
      } else {
        console.log(error);
        res.sendStatus(500);
      }
    }
  }

  async updateCameraHandler(req, res) {
    try {
      const cameraId = req.params.cameraId;
      const camera = req.body;
      const result = await this.condoAdminQueries.updateCameraById(
        cameraId,
        camera
      );
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async updateUserHandler(req, res) {
    try {
      const userId = req.params.userId;
      const user = req.body;
      const result = await this.condoAdminQueries.updateUserById(userId, user);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async updateUnitHandler(req, res) {
    try {
      const unitId = req.params.unitId;
      const carArr = [];
      for (const key in req.body) {
        if (key.startsWith("car_list")) {
          carArr.push(req.body[key]);
          delete req.body[key];
        }
      }
      req.body.car_list = JSON.stringify(carArr);
      const result = await this.condoAdminQueries.updateUnitById(
        unitId,
        req.body
      );
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async createCondoHandler(req, res) {
    try {
      const condo = req.body;
      const result = await this.condoAdminQueries.createNewCondo(condo);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}

export default CondoAdminRoutes;
