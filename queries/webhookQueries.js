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
      .join("unit_cars", "units.unit_id", "=", "unit_cars.unit_id")
      .where("cameras.Data_source_camera_id", camId)
      .where("unit_cars.plate_number", plateNumber)
      .select(
        "unit_cars.car_id",
        this.db.knex.raw(`unit_cars.car_pic IS NOT NULL as has_pic`)
      )
      .first();
    return hasUnit;
  }

  async insertCarPicture(picture, carId) {
    return await this.db
      .knex("unit_cars")
      .where("car_id", carId)
      .update({ car_pic: picture });
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
