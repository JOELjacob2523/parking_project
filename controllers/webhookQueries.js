import Database from "./db.js";

class WebhookQueries {
  constructor() {
    this.db = new Database();
  }
  async insertCameraLog(log) {
    return await this.db.knex("cameralogs").insert(log);
  }

  async seeIfCarIsAllowed(plateNumber, camId) {
    const carList = await this.db
      .knex("units")
      .innerJoin("lots", "units.condo_id", "lots.condo_id")
      .innerJoin("cameras", "lots.lot_id", "cameras.lot_id")
      .where("Data_source_camera_id", camId)
      .whereRaw(
        `JSON_CONTAINS(units.car_list->"$.list", '"${plateNumber}"','$')`
      )
      .select("units.unit_id", "units.car_list");
    return carList.length == 0 ? false : true;
  }

  async deleteLog(id) {
    return await this.db.knex("cameralogs").where("log_id", id).del();
  }

  async getLogForPlateIfExistsInLogs(plateNumber) {
    return await this.db
      .knex("cameralogs")
      .where("plate_number", plateNumber)
      .where("completion_state", false)
      .where("archive", false)
      .select("*");
  }

  async setLogAsArchive(id) {
    return await this.db
      .knex("cameralogs")
      .where("log_id", id)
      .update({ archive: true });
  }
}

export default WebhookQueries;
