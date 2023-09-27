const express = require("express");
const SARouter = require("express").Router();
const path = require("path");

const {
  createUser,
  createCondo,
  createLot,
  createUnit,
  createCamera,
  getMaxCarsOfCondo,
  getCondos,
  getCondoById,
  getLotsByCondoId,
  getLotById,
  getUsers,
  getUserById,
  getCondoUsers,
  getAllLogs,
  getLogsByCondoId,
} = require("../controllers/superAdminQueries");

const { createUnitList } = require("../Utilities/superAdminUtilites");

const superAdminBuildPath = path.join(__dirname, "../super-admin-portal/build");
SARouter.use("/", express.static(superAdminBuildPath));

// & create user
SARouter.post("/create/user", async (req, res) => {
  /**
   * ~ required fields ~
   * ^ username
   * ^ email
   * ^ password
   * ^ phone_number_main
   * ^ user_role
   */
  try {
    const userId = await createUser(req.body);
    res.json({ userId: userId[0] }).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// & create condo
SARouter.post("/create/condo", async (req, res) => {
  /**
   * ~ required fields ~
   * ^ condo_admin_id
   * ^ city
   * ^ state
   * ^ zip_code
   */
  try {
    const condoId = await createCondo(req.body);
    res.json({ condoId: condoId[0] }).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// & create lot
SARouter.post("/create/lot", async (req, res) => {
  /**
   * ~ required fields ~
   * ^ condo_id
   * ^ lot_address
   * ^ lot_name
   */
  try {
    const lotId = await createLot(req.body);
    res.json({ lotId: lotId[0] }).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// & 2 options 1) create unit 2) create units list
SARouter.post("/create/units/:condoId", async (req, res) => {
  /**
   * ~ required fields ~
   * ^ condo_id
   * ^ unit
   * ^ car_list /& JSON /? list
   * */
  try {
    if (Object.keys(req.query).length === 0) {
      let unitInfo = req.body;
      let max_cars = await getMaxCarsOfCondo(req.params.condoId);
      max_cars = max_cars[0].max_cars;
      unitInfo.max_cars = max_cars;
      await createUnit(unitInfo);
    } else {
      await createUnitList(req.query);
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// & create camera
SARouter.post("/create/camera", async (req, res) => {
  /**
   * ~ required fields ~
   *  ^ Data_source_camera_id
   * ^ lot_id
   * */
  try {
    await createCamera(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// & 2 options 1) get all condos 2) get condo by id
SARouter.get("/get/condos/:id?", async (req, res) => {
  try {
    let condos;
    if (req.params.id) {
      condos = await getCondoById(req.params.id);
    } else {
      condos = await getCondos();
    }
    res.json(condos).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// & get all lots by condo id
SARouter.get("/get/lots/:condoId", async (req, res) => {
  try {
    const lots = await getLotsByCondoId(req.params.condoId);
    res.json(lots).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// & get lot by id
SARouter.get("/get/lot/:lotId", async (req, res) => {
  try {
    const lot = await getLotById(req.params.lotId);
    res.json(lot).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// & get all users
SARouter.get("/get/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// & get user by id
SARouter.get("/get/user/:userId", async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);
    res.json(user).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// & get all users by condo id
SARouter.get("/get/usersByCondo/:condoId", async (req, res) => {
  try {
    const users = await getCondoUsers(req.params.condoId);
    res.json(users).status(200).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

/*
 * & 2 options 1) get all logs
 * & 2) get logs by condo id (archive)
 * & 3) get logs by condo id (not archive)
 */
SARouter.get("/get/logs/:condoId?", async (req, res) => {
  try {
    const archive = req.query.archive;
    const condoId = req.params.condoId;
    if (condoId) {
      if (archive) {
        const logs = await getLogsByCondoId(condoId, archive);
        res.json(logs).status(200).end();
      } else {
        const logs = await getLogsByCondoId(condoId);
        res.json(logs).status(200).end();
      }
    } else {
      const logs = await getAllLogs();
      res.json(logs).status(200).end();
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = SARouter;
