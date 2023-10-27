import Database from "./db.js";

class WebhookQueries {
  constructor() {
    this.db = new Database();
    this.cache = new Map();
  }
  async insertCameraLog(log) {
    return await this.db.knex("cameralogs").insert(log);
  }

  async getDataSourcesIdForAllowedCar(camId, plateNumber) {
    return await this.db
    .knex("units")
    .join("lots", "units.condo_id", "=", "lots.condo_id")
    .join("cameras", "lots.lot_id", "=", "cameras.lot_id")
    .where("Data_source_camera_id", camId)
    .where("car_list", "like", `%${plateNumber}%`)
    .select("Data_source_camera_id");
  }
  

  async deleteLog(id) {
    return await this.db.knex("cameralogs").where("log_id", id).del();
  }

  async getDuplicateLogNotArchived(plateNumber) {
    return await this.db
      .knex("cameralogs")
      .where("plate_number", plateNumber)
      .where("completion_state", false)
      .where("archive", false)
      .select("cameralogs.log_id");
  }

  async setLogAsArchive(id) {
    return await this.db
      .knex("cameralogs")
      .where("log_id", id)
      .update({ archive: true });
  }
}

export default WebhookQueries;
