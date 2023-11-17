import CondoAdminQueries from "../queries/condoAdminQueries.js";

class CarHandler {
  constructor() {
    this.condoAdminQueries = new CondoAdminQueries();
  }

  async updateCar(car, carId) {
    try {
      const oldPlate = await this.condoAdminQueries.getPlateNumberForCar(carId);
      console.log(oldPlate, "oldPlate");

      let lastLog = await this.condoAdminQueries.getLastLog(
        oldPlate.plate_number
      );
      console.log(lastLog, "lastLog");
      if (lastLog && lastLog.archive && lastLog.direction === "In") {
        console.log("here");
        await this.condoAdminQueries.updateArciveLog(lastLog.log_id, false);
      }

      const newPlate = car.plate_number;
      lastLog = await this.condoAdminQueries.getLastLog(newPlate);
      console.log(lastLog, "lastLog");
      if (lastLog && !lastLog.locked && lastLog.direction === "In") {
        await this.condoAdminQueries.updateArciveLog(lastLog.log_id, true);
      } else if (lastLog && lastLog.locked) {
        throw new Error("Car is locked");
      }
      const res = await this.condoAdminQueries.updateCarById(carId, car);
      return res;
    } catch (error) {
      console.trace(error);
      throw new Error(error);
    }
  }

  async createCar(car) {
    try {
      const lastLog = await this.condoAdminQueries.getLastLog(car.plate_number);
      console.log(lastLog, "lastLog");

      if (lastLog && !lastLog.locked && lastLog.direction === "In") {
        await this.condoAdminQueries.updateArciveLog(lastLog.log_id, true);
      } else if (lastLog && lastLog.locked) {
        throw new Error("Car is locked");
      }

      const res = await this.condoAdminQueries.createNewCar(car);
      return res;
    } catch (error) {
      console.trace(error);
      throw new Error(error);
    }
  }

  async deleteCar(carId) {
    try {
      const carPlate = await this.condoAdminQueries.getPlateNumberForCar(carId);
      const lastLog = await this.condoAdminQueries.getLastLog(carPlate);
      if (lastLog && lastLog.direction === "In") {
        await this.condoAdminQueries.updateArciveLog(lastLog.log_id, false);
      }

      const res = await this.condoAdminQueries.deleteCar(carId);

      return res;
    } catch (error) {
      console.trace(error);
      throw new Error(error);
    }
  }

}

export default CarHandler;
