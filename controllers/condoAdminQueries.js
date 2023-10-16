import Database from "./db.js";

class CondoAdminQueries {
  constructor() {
    this.db = new Database();
  }
  async getCondoByAdminId(adminId) {
    return await this.db
      .knex("condos")
      .select("*")
      .where({ condo_admin_id: adminId });
  }

  async getLotsByCondoId(condoId) {
    return await this.db.knex("lots").select("*").where({ condo_id: condoId });
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
      .join("condos", "units.condo_id", "=", "condos.condo_id")
      .where("condos.condo_id", condoId)
      .select("*");
  }
}

export default CondoAdminQueries;
