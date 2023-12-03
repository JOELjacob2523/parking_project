import express from "express";
import CondoAdminQueries from "../queries/condoAdminQueries.js";
import CarHandler from "../modules/CarHandler.js";
import CAdminAuthMiddleware from "../middleware/CAdminAuthMiddleware.js";

class CondoAdminRoutes {
  constructor() {
    this.router = express.Router();
    this.condoAdminQueries = new CondoAdminQueries();
    this.carHandler = new CarHandler();

    //Middleware
    this.router.use(CAdminAuthMiddleware.verifyToken);

    // All Get Routes
    this.router.get("/get/condos", this.getCondoByAdminId.bind(this));
    this.router.get("/get/cameras/:lotId", this.getCamerasByLotId.bind(this));
    this.router.get(
      "/get/logs/:condoId",
      this.getLogsBycondoIdHandler.bind(this)
    );
    this.router.get("/get/cars/:unitId", this.getCarsByUnitId.bind(this));
    this.router.get(
      "/get/units/:condoId",
      this.getUnitsByCondoIdHandler.bind(this)
    );
    this.router.get(
      "/get/users/:condoId",
      this.getUsersByCondoIdHandler.bind(this)
    );
    this.router.get(
      "/get/lots/:condoId",
      this.getLotsByCondoIdHandler.bind(this)
    );

    this.router.get("/get/condo/maxCars/:condoId", this.getMaxCars.bind(this));

    // All Put Routes
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
    this.router.put("/update/car/:carId", this.updateCarHandler.bind(this));

    // All Post Routes
    this.router.post("/create/condo", this.createCondoHandler.bind(this));
    this.router.post("/create/lot", this.createLotHandler.bind(this));
    this.router.post("/create/camera", this.createCameraHandler.bind(this));
    this.router.post("/create/user", this.createUserHandler.bind(this));
    this.router.post("/create/unit", this.createUnitHandler.bind(this));
    this.router.post("/create/car", this.createCarHandler.bind(this));

    // All Delete Routes
    this.router.delete(
      "/delete/condo/:condoId",
      this.deleteCondoHandler.bind(this)
    );
    this.router.delete("/delete/lot/:lotId", this.deleteLotHandler.bind(this));

    this.router.delete(
      "/delete/camera/:cameraId",
      this.deleteCameraHandler.bind(this)
    );

    this.router.delete(
      "/delete/user/:userId",
      this.deleteUserHandler.bind(this)
    );

    this.router.delete(
      "/delete/unit/:unitId",
      this.deleteUnitHandler.bind(this)
    );

    this.router.delete("/delete/car/:carId", this.deleteCarHandler.bind(this));
  }

  async getCondoByAdminId(req, res) {
    try {
      const adminId = req.userId;
      let condos = await this.condoAdminQueries.getCondoByAdminId(adminId);
      res.json(condos).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getLotsByCondoIdHandler(req, res) {
    console.log(req.params.condoId);
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
    console.log(req.params.lotId);
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

  async getLogsBycondoIdHandler(req, res) {
    console.log(req);
    try {
      const condoId = req.params.condoId;
      const logs = await this.condoAdminQueries.getNotAllowedLogsByCondoId(
        condoId
      );
      res.json(logs).status(200);
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

  async getCarsByUnitId(req, res) {
    try {
      const cars = await this.condoAdminQueries.getCarsByUnitId(
        req.params.unitId
      );
      console.log(cars);
      res.json(cars).status(200);
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

  async getMaxCars(req, res) {
    try {
      const condoId = req.params.condoId;
      const maxCars = await this.condoAdminQueries.getMaxCars(condoId);
      res.json(maxCars).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async updateLotHandler(req, res) {
    try {
      console.log(req.body);
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
      console.log(error);
      res.sendStatus(500);
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
    console.log(req.body, "body");
    try {
      const unitId = req.params.unitId;
      const unit = req.body;
      const result = await this.condoAdminQueries.updateUnitById(unitId, unit);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async updateCarHandler(req, res) {
    console.log(req.body, "body");
    try {
      const carId = req.params.carId;
      const car = req.body;
      const result = await this.carHandler.updateCar(car, carId);
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

  async createLotHandler(req, res) {
    console.log(req.body);
    try {
      const lot = req.body;
      const result = await this.condoAdminQueries.createNewLot(lot);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async createCameraHandler(req, res) {
    try {
      const camera = req.body;
      const result = await this.condoAdminQueries.createNewCamera(camera);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async createUserHandler(req, res) {
    const created_by = req.body.userId ? req.body.userId : 1; // TODO: remove this line
    try {
      const user = req.body;
      const result = await this.condoAdminQueries.createNewUser(
        user,
        created_by
      );
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async createUnitHandler(req, res) {
    console.log(req.body);
    try {
      const unit = req.body;
      const result = await this.condoAdminQueries.createNewUnit(unit);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async createCarHandler(req, res) {
    try {
      const car = req.body;
      const result = await this.carHandler.createCar(car);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async deleteCondoHandler(req, res) {
    try {
      const condoId = req.params.condoId;
      console.log(condoId);
      const result = await this.condoAdminQueries.deleteCondoById(condoId);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async deleteLotHandler(req, res) {
    try {
      const lotId = req.params.lotId;
      const result = await this.condoAdminQueries.deleteLotById(lotId);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async deleteUnitHandler(req, res) {
    try {
      const unitId = req.params.unitId;
      const result = await this.condoAdminQueries.deleteUnitById(unitId);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async deleteCarHandler(req, res) {
    try {
      const carId = req.params.carId;
      const result = await this.carHandler.deleteCar(carId);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async deleteUserHandler(req, res) {
    try {
      const userId = req.params.userId;
      console.log(req.params);
      const result = await this.condoAdminQueries.deleteUserById(userId);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async deleteCameraHandler(req, res) {
    try {
      const cameraId = req.params.cameraId;
      const result = await this.condoAdminQueries.deleteCameraById(cameraId);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}

export default CondoAdminRoutes;
