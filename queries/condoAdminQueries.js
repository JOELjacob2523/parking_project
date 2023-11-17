import Database from "../controllers/db.js";

class CondoAdminQueries {
  constructor() {
    this.db = new Database();
  }
  async getCondoByAdminId(adminId) {
    return await this.db
      .knex("condos")
      .select(
        "condos.*",
        this.db.knex.raw("count(lots.lot_id) as lot_count"),
        this.db.knex.raw(
          "(select count(*) from units where units.condo_id = condos.condo_id) as unit_count"
        )
      )
      .leftJoin("lots", "condos.condo_id", "=", "lots.condo_id")
      .where({ condo_admin_id: adminId })
      .groupBy("condos.condo_id");
  }

  async getLotsByCondoId(condoId) {
    return await this.db
      .knex("lots")
      .select(
        "lots.*",
        this.db.knex.raw("count(cameras.camera_id) as camera_count")
      )
      .leftJoin("cameras", "lots.lot_id", "=", "cameras.lot_id")
      .where({ condo_id: condoId })
      .groupBy("lots.lot_id");
  }

  async getCamerasByLotId(lotId) {
    return await this.db
      .knex("cameras")
      .select("cameras.*", "lots.condo_id")
      .leftJoin("lots", "cameras.lot_id", "=", "lots.lot_id")
      .where({ "cameras.lot_id": lotId });
  }

  async getUsersByCondoId(condoId) {
    return await this.db
      .knex("users")
      .select(
        "users.user_id",
        "users.username",
        "users.email",
        "users.phone_number_main",
        "users.phone_number_2",
        "users.is_active",
        "users.user_role",

        this.db.knex.raw("count(units.unit_id) as unit_count")
      )
      .leftJoin("units", "users.user_id", "=", "units.user_id")
      .where({ "units.condo_id": condoId })
      .groupBy("users.user_id");
  }

  async getLogsByCondoId(condoId, archive = true) {
    return await this.db
      .knex("cameralogs")
      .join(
        "cameras",
        "cameralogs.data_source_cam_id",
        "=",
        "cameras.Data_source_camera_id"
      )
      .join("lots", "cameras.lot_id", "=", "lots.lot_id")
      .join("condos", "lots.condo_id", "=", "condos.condo_id")
      .where("condos.condo_id", condoId)
      .where("cameralogs.archive", archive)
      .select("*");
  }

  async getAllLogs() {
    return await this.db
      .knex("cameralogs")
      .where("completion_state", false)
      .where("archive", true)
      .select("*");
  }

  async getNotAllowedLogsByLotId(lotId) {
    return await this.db
      .knex("cameralogs")
      .join(
        "cameras",
        "cameralogs.data_source_cam_id",
        "=",
        "cameras.Data_source_camera_id"
      )
      .where("cameras.lot_id", lotId)
      .where("cameralogs.Completion_state", false)
      .where("cameralogs.archive", false)
      .select(
        "cameras.camera_id",
        "cameras.lot_id",
        "cameralogs.log_id",
        "cameralogs.log_time",
        "cameralogs.plate_number",
        "cameralogs.car_color",
        "cameralogs.car_make",
        "cameralogs.car_model",
        "cameralogs.car_type",
        "cameralogs.car_year"
      );
  }

  async getUnitsByCondoId(condoId) {
    return await this.db
      .knex("units")
      .leftJoin("users", "units.user_id", "=", "users.user_id")
      .where("condo_id", condoId)
      .select("units.*", "users.username");
  }

  async getCarsByUnitId(unitId) {
    return await this.db
      .knex("unit_cars")
      .leftJoin(
        "cameralogs",
        "unit_cars.plate_number",
        "cameralogs.plate_number"
      )
      .leftJoin(
        "cameras",
        "cameralogs.data_source_cam_id",
        "cameras.Data_source_camera_id"
      )
      .leftJoin("lots", "cameras.lot_id", "lots.lot_id")
      .where("unit_id", unitId)
      .select(
        "car_id",
        "unit_cars.plate_number",
        "unit_cars.car_make",
        "unit_cars.car_model",
        "unit_cars.car_color",
        this.db.knex.raw("car_pic IS NOT NULL as has_pic"),
        this.db.knex.raw("COALESCE(MAX(lots.locked), false) as locked")
      )
      .groupBy(
        "car_id",
        "unit_cars.plate_number",
        "unit_cars.car_make",
        "unit_cars.car_model",
        "unit_cars.car_color",
        "car_pic"
      );
  }

  async getMaxCars(condoId) {
    const [max_cars] = await this.db
      .knex("condos")
      .where("condo_id", condoId)
      .select("max_cars");

    return max_cars;
  }

  async updateLotById(lotId, lot) {
    return await this.db.knex("lots").where("lot_id", lotId).update(lot);
  }

  async updateCondoById(condoId, condo) {
    return await this.db
      .knex("condos")
      .where("condo_id", condoId)
      .update(condo);
  }

  async updateCameraById(cameraId, camera) {
    return await this.db
      .knex("cameras")
      .where("camera_id", cameraId)
      .update(camera);
  }

  async updateUserById(userId, user) {
    user.last_update = new Date();
    return await this.db.knex("users").where("user_id", userId).update(user);
  }

  async updateUnitById(unitId, unit) {
    return await this.db.knex("units").where("unit_id", unitId).update(unit);
  }

  async updateCarById(carId, car) {
    car.last_updated = new Date();
    return await this.db.knex("unit_cars").where("car_id", carId).update(car);
  }

  async getLastLog(plateNumber) {
    return await this.db
      .knex("cameralogs")
      .join(
        "cameras",
        "cameralogs.data_source_cam_id",
        "cameras.Data_source_camera_id"
      )
      .join("lots", "cameras.lot_id", "lots.lot_id")
      .where("plate_number", plateNumber)
      .where("completion_state", false)
      .orderBy("cameralogs.log_id", "desc")
      .first(
        "cameralogs.log_id",
        "cameralogs.direction",
        "cameralogs.archive",
        "lots.lot_id",
        "lots.locked"
      );
  }

  async updateArciveLog(logId, status) {
    console.log("logId", logId, "status", status);
    return await this.db
      .knex("cameralogs")
      .where("log_id", logId)
      .update({ archive: status });
  }

  async getPlateNumberForCar(carId) {
    const [plate_number] = await this.db

      .knex("unit_cars")
      .where("car_id", carId)
      .select("plate_number");

    return plate_number;
  }

  async createNewLot(lot) {
    return await this.db.knex("lots").insert(lot);
  }

  async createNewCamera(camera) {
    return await this.db.knex("cameras").insert(camera);
  }

  async createNewUser(user, createdBy) {
    user.created_by = createdBy;
    return await this.db.knex("users").insert(user);
  }

  async createNewCar(car) {
    return await this.db.knex("unit_cars").insert(car);
  }

  async createNewUnit(unit) {
    return await this.db.knex("units").insert(unit);
  }

  async deleteCondoById(condoId) {
    return await this.db.knex.transaction(async (trx) => {
      // Delete logs through cameras and lots
      const cameras = await trx("cameras")
        .join("lots", "cameras.lot_id", "lots.lot_id")
        .where("lots.condo_id", condoId)
        .select("cameras.camera_id");
      for (let camera of cameras) {
        await trx("cameralogs")
          .where("data_source_cam_id", camera.Data_source_camera_id)
          .del();
      }

      // Delete cameras through lots
      const lots = await trx("lots")
        .where("condo_id", condoId)
        .select("lot_id");
      for (let lot of lots) {
        await trx("cameras").where("lot_id", lot.lot_id).del();
      }

      // Delete units, and lots
      await trx("units").where("condo_id", condoId).del();
      await trx("lots").where("condo_id", condoId).del();

      // Delete user that are linded only to this condo Units
      const usersToDelete = await trx("users")
        .leftJoin("units", "users.user_id", "units.user_id")
        .where("units.condo_id", condoId)
        .select("users.user_id");
      for (let user of usersToDelete) {
        await trx("users").where("user_id", user.user_id).del();
      }

      // Finally, delete the condo
      await trx("condos").where("condo_id", condoId).del();
    });
  }

  async deleteLotById(lotId) {
    return await this.db.knex.transaction(async (trx) => {
      // Delete logs through cameras
      const cameras = await trx("cameras")
        .where("lot_id", lotId)
        .select("camera_id");
      for (let camera of cameras) {
        await trx("cameralogs")
          .where("data_source_cam_id", camera.Data_source_camera_id)
          .del();
      }

      // Delete cameras
      await trx("cameras").where("lot_id", lotId).del();

      // Finally, delete the lot
      await trx("lots").where("lot_id", lotId).del();
    });
  }

  async deleteUnitById(unitId) {
    return await this.db.knex.transaction(async (trx) => {
      // Get all cars associated with the unit
      const cars = await trx("unit_cars")
        .where("unit_id", unitId)
        .select("plate_number");

      for (let car of cars) {
        // Get the latest log for the car
        const latestLog = await trx("cameralogs")
          .where("plate_number", car.plate_number)
          .orderBy("log_id", "desc")
          .first();

        // If the latest log is 'in', set 'archive' to false
        if (latestLog && latestLog.direction === "In") {
          await trx("cameralogs")
            .where("log_id", latestLog.log_id)
            .update({ archive: false });
        }
      }

      // Delete all cars associated with the unit
      await trx("unit_cars").where("unit_id", unitId).del();

      // Delete the unit
      await trx("units").where("unit_id", unitId).del();
    });
  }

  async deleteUserById(userId) {
    return await this.db.knex.transaction(async (trx) => {
      // Update Units owner to null
      await trx("units").where("user_id", userId).update({ user_id: null });

      // Update towing_driver_id to null
      await trx("condos")
        .where("towing_driver_id", userId)
        .update({ towing_driver_id: null });

      // Finally, delete the user
      await trx("users").where("user_id", userId).del();
    });
  }

  async deleteCameraById(cameraId) {
    return await this.db.knex.transaction(async (trx) => {
      // Delete logs
      await trx("cameralogs").where("data_source_cam_id", cameraId).del();

      // Finally, delete the camera
      await trx("cameras").where("camera_id", cameraId).del();
    });
  }

  async deleteCar(carId) {
    return await this.db.knex("unit_cars").where("car_id", carId).del();
  }
}

export default CondoAdminQueries;
