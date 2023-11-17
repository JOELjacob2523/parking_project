import Database from "../controllers/db.js";

class ImageQueries {
  constructor() {
    this.db = new Database();
    this.getCarImageForLog = this.getCarImageForLog.bind(this);
    this.getPlateImageForLog = this.getPlateImageForLog.bind(this);
    this.getCarImageForUnitCar = this.getCarImageForUnitCar.bind(this);
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

  async getCarImageForUnitCar(unitCarId) {
    return await this.db
      .knex("unit_cars")
      .where("car_id", unitCarId)
      .select("car_pic");
  }
}

export default ImageQueries;
