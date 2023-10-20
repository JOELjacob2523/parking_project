import { json } from "express";
import Database from "./db.js";

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

  async getTowingDriverByCondoId(condoId) {
    const res = await this.db
      .knex("users")
      .select("users.username", "users.user_id")
      .leftJoin("units", "users.user_id", "=", "units.user_id")
      .where({ "units.condo_id": condoId })
      .where({ "users.user_role": "towing" })
      .groupBy("users.user_id");
      console.log(res);
    const arr = res.map((item) => {
      return {
        label: item.username,
        value: item.user_id,
      };
    });
    return arr;
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

  async getUnitsByCondoId(condoId) {
    return await this.db
      .knex("units")
      .join("users", "units.user_id", "=", "users.user_id")
      .where("condo_id", condoId)
      .select("units.*", "users.username");
  }
}

export default CondoAdminQueries;
