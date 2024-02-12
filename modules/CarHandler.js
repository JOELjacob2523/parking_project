import CondoAdminQueries from "../queries/condoAdminQueries.js";

/**
 * Represents a CarHandler object that handles car-related operations.
 */
class CarHandler {
  constructor() {
    this.condoAdminQueries = new CondoAdminQueries();
  }

  /**
   * Updates a car with the given car object and car ID.
   * @param {Object} car - The updated car object.
   * @param {number} carId - The ID of the car to be updated.
   * @returns {Promise<Object>} - A promise that resolves to the updated car object.
   * @throws {Error} - If there is an error during the update process.
   */
  async updateCar(car, carId) {
    try {
      const oldPlate = await this.condoAdminQueries.getPlateNumberForCar(carId);

      let lastLog = await this.condoAdminQueries.getLastLog(
        oldPlate.plate_number
      );
      if (lastLog && lastLog.archive && lastLog.direction === "In") {
        await this.condoAdminQueries.updateArciveLog(lastLog.log_id, false);
      }

      const newPlate = car.plate_number;
      lastLog = await this.condoAdminQueries.getLastLog(newPlate);
      if (lastLog && !lastLog.locked && lastLog.direction === "In") {
        await this.condoAdminQueries.updateArciveLog(lastLog.log_id, true);
      } else if (lastLog && lastLog.locked && lastLog.direction === "In") {
        throw new Error("Car is locked");
      }
      const res = await this.condoAdminQueries.updateCarById(carId, car);
      return res;
    } catch (error) {
      console.trace(error);
      throw new Error(error);
    }
  }

  /**
   * Creates a new car entry.
   * @param {Object} car - The car object containing the details of the car.
   * @returns {Promise} A promise that resolves with the result of creating the car entry.
   * @throws {Error} If there is an error creating the car entry.
   */
  async createCar(car) {
    try {
      const lastLog = await this.condoAdminQueries.getLastLog(car.plate_number);

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

  /**
   * Deletes a car from the system.
   * 
   * @param {string} carId - The ID of the car to be deleted.
   * @returns {Promise} A promise that resolves with the result of the deletion.
   * @throws {Error} If an error occurs during the deletion process.
   */
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
