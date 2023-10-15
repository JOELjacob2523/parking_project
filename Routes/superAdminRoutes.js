import express from "express";
import SuperAdminQueries from "../controllers/superAdminQueries.js";
import superAdminUtilites from "../Utilities/superAdminUtilites.js";

class SuperAdminRoutes {
  constructor() {
    this.router = express.Router();
    this.superAdminQueries = new SuperAdminQueries();
    this.superAdminUtilites = new superAdminUtilites();

    this.router.post("/create/user", this.createUserHandler.bind(this));
    this.router.post("/create/condo", this.createCondoHandler.bind(this));
    this.router.post("/create/lot", this.createLotHandler.bind(this));
    this.router.post(
      "/create/unit/:condoId",
      this.createUnitHandler.bind(this)
    );
    this.router.post("/create/camera", this.createCameraHandler.bind(this));
    this.router.get("/get/condos/:id?", this.getCondosHandler.bind(this));
    this.router.get("/get/lots/:condoId", this.getLotsHandler.bind(this));
    this.router.get("/get/lot/:lotId", this.getLotByIdHandler.bind(this));
    this.router.get("/get/users", this.getUsersHandler.bind(this));
    this.router.get("/get/user/:userId", this.getUserByIdHandler.bind(this));
    this.router.get(
      "/get/usersByCondo/:condoId",
      this.getCondoUsersHandler.bind(this)
    );
    this.router.get("/get/logs/:condoId?", this.getLogsHandler.bind(this));
  }

  async createUserHandler(req, res) {
    /**
     * ~ required fields ~
     * ^ username
     * ^ email
     * ^ password
     * ^ phone_number_main
     * ^ user_role
     */
    try {
      const userId = await this.superAdminQueries.createUser(req.body);
      res.json({ userId: userId[0] }).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async createCondoHandler(req, res) {
    /**
     * ~ required fields ~
     * ^ condo_admin_id
     * ^ city
     * ^ state
     * ^ zip_code
     */
    try {
      const condoId = await this.superAdminQueries.createCondo(req.body);
      res.json({ condoId: condoId[0] }).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async createLotHandler(req, res) {
    /**
     * ~ required fields ~
     * ^ condo_id
     * ^ lot_number
     * ^ max_cars
     */
    try {
      const lotId = await this.superAdminQueries.createLot(req.body);
      res.json({ lotId: lotId[0] }).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async createUnitHandler(req, res) {
    /**
     * ~ required fields ~
     * ^ condo_id
     * ^ Unit
     * ^ car_list /& JSON /? list
     */
    try {
      if (Object.keys(req.body).length === 0) {
        let unitInfo = req.body;
        let max_cars = await this.superAdminQueries.getMaxCarsOfCondo(
          req.params.condoId
        );
        max_cars = max_cars[0].max_cars;
        unitInfo.max_cars = max_cars;
        await this.superAdminQueries.createUnit(unitInfo);
      } else {
        let unitList = req.body;
        let max_cars = await this.superAdminQueries.getMaxCarsOfCondo(
          req.params.condoId
        );
        max_cars = max_cars[0].max_cars;
        unitList = createUnitList(unitList, max_cars);
        await this.superAdminUtilites.createUnitList(unitList);
      }
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async createCameraHandler(req, res) {
    /**
     * ~ required fields ~
     *  ^ Data_source_camera_id
     * ^ lot_id
     * */
    try {
      await this.superAdminQueries.createCamera(req.body);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getCondosHandler(req, res) {
    try {
      let condos;
      if (req.params.id) {
        condos = await this.superAdminQueries.getCondoById(req.params.id);
      } else {
        condos = await this.superAdminQueries.getCondos();
      }
      res.json(condos).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getLotsHandler(req, res) {
    try {
      const lots = await this.superAdminQueries.getLotsByCondoId(
        req.params.condoId
      );
      res.json(lots).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getLotByIdHandler(req, res) {
    try {
      const lot = await this.superAdminQueries.getLotById(req.params.lotId);
      res.json(lot).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getUsersHandler(req, res) {
    try {
      const users = await this.superAdminQueries.getUsers();
      res.json(users).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getUserByIdHandler(req, res) {
    try {
      const user = await this.superAdminQueries.getUserById(req.params.userId);
      res.json(user).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getCondoUsersHandler(req, res) {
    try {
      const users = await this.superAdminQueries.getCondoUsers(
        req.params.condoId
      );
      res.json(users).status(200).end();
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getLogsHandler(req, res) {
    try {
      const archive = req.query.archive;
      const condoId = req.params.condoId;
      if (condoId) {
        if (archive) {
          const logs = await this.superAdminQueries.getLogsByCondoId(
            condoId,
            archive
          );
          res.json(logs).status(200).end();
        } else {
          const logs = await this.superAdminQueries.getLogsByCondoId(condoId);
          res.json(logs).status(200).end();
        }
      } else {
        const logs = await this.superAdminQueries.getAllLogs();
        res.json(logs).status(200).end();
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}

export default SuperAdminRoutes;
