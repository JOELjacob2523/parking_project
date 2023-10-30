class WebhookQueries {
  constructor(db) {
    this.db = db;
  }
  async insertCameraLog(log) {
    return await this.db.knex("cameralogs").insert(log);
  }

  async seeIfCarAllowed(camId, plateNumber) {
    const hasUnit = await this.db
      .knex("units")
      .join("lots", "units.condo_id", "=", "lots.condo_id")
      .join("cameras", "lots.lot_id", "=", "cameras.lot_id")
      .where("cameras.Data_source_camera_id", camId)
      .where("units.car_list", "like", `%${plateNumber}%`)
      .select(this.db.knex.raw("EXISTS(SELECT 1) AS has_unit"));

    return hasUnit[0].has_unit;
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

  async updateLogAsArchive(id) {
    return await this.db
      .knex("cameralogs")
      .where("log_id", id)
      .update({ archive: true });
  }
}

export default WebhookQueries;
