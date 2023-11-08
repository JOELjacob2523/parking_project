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
        "users.is_active",
        "users.user_role",

        this.db.knex.raw("count(units.unit_id) as unit_count")
      )
      .leftJoin("units", "users.user_id", "=", "units.user_id")
      .where({ "units.condo_id": condoId })
      .groupBy("users.user_id");
  }

  async getCondoIdAddressByAdminId(adminId) {
    const res = await this.db
      .knex("condos")
      .select("condos.condo_id", "condos.condo_address")
      .where({ condo_admin_id: adminId });

    const arr = res.map((item) => {
      return {
        value: item.condo_id,
        label: item.condo_address,
      };
    });

    return arr;
  }

  async getUsersIdNameByCondoId(adminId) {
    const res = await this.db
      .knex("users")
      .distinct("users.user_id", "users.username")
      .join("units", "users.user_id", "=", "units.user_id")
      .join("condos", "units.condo_id", "=", "condos.condo_id")
      .where({ "condos.condo_admin_id": adminId });

    const arr = res.map((item) => {
      return {
        value: item.user_id,
        label: item.username,
      };
    });

    return arr;
  }

  async CameraExist(id, uptRcId) {
    console.log("id", id);
    console.log("uptRcId", uptRcId);
    let query = this.db.knex("cameras").where("Data_source_camera_id", id);

    if (uptRcId !== undefined) {
      query = query.whereNot("camera_id", uptRcId);
    }

    const result = await query.first();

    return result !== undefined;
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

  async getCarImageForLog(logId) {
    return await this.db
      .knex("cameralogs")
      .where("log_id", logId)
      .select("vehicle_pic");
  }

  async getPlateImageForLog(logId) {
    return await this.db
      .knex("cameralogs")
      .where("log_id", logId)
      .select("plate_pic");
  }

  async getUnitsByCondoId(condoId) {
    return await this.db
      .knex("units")
      .join("users", "units.user_id", "=", "users.user_id")
      .where("condo_id", condoId)
      .select("units.*", "users.username");
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
    return await this.db.knex("users").where("user_id", userId).update(user);
  }

  async updateUnitById(unitId, unit) {
    return await this.db.knex("units").where("unit_id", unitId).update(unit);
  }

  async createNewCondo(condo) {
    return await this.db.knex("condos").insert(condo);
  }

  async createNewLot(lot) {
    return await this.db.knex("lots").insert(lot);
  }

  async createNewCamera(camera) {
    return await this.db.knex("cameras").insert(camera);
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
}

export default CondoAdminQueries;
