import Database from "../controllers/db.js";
import WebhookQueries from "../queries/webhookQueries.js";

/**
 * This class is representing a the OPENALPR webhook POST request
 * And is used to handle the camera logs
 */
class Log {
  constructor(webhook) {
    this.db = new Database();
    this.webhookQueries = new WebhookQueries(this.db);
    this.webhook = webhook;
    this.log = this.#logFormatter();
  }

  /**
   * This Is the main function of the class
   * @param {Object} log
   * @returns Undefined
   */
  async handelCameraLog() {
    try {
      const isAllowed = await this.#seeIfCarIsAllowed();
      //? if allowed insert log as archive
      if (isAllowed) {
        this.#setLogAsArchive();
        await this.#insertLog();
        return;
      }
      //? if not allowed see if car is in logs
      const duplicateLog = await this.webhookQueries.getDuplicateLogNotArchived(
        this.log.plate_number
      );
      //? if car is in logs
      if (duplicateLog.length > 0) {
        //? if current log is in delete the duplicate log and insert the current log
        if (this.log.direction == "In") {
          await this.webhookQueries.deleteLog(duplicateLog[0].log_id);
          await this.#insertLog();
          return;
        }
        //? if current log is out set logs as archive and insert the current log
        else if (this.log.direction == "Out") {
          this.webhookQueries.updateLogAsArchive(duplicateLog[0].log_id);
          this.#setLogAsArchive();
          await this.#insertLog();
          return;
        }
      }
      //? if car is not in logs and Not Allowed insert the current log if it is in insert log
      if (this.log.direction == "In") {
        await this.#insertLog();
        return;
      }
      //? if car is not in logs and direction is out
      //? or direction is not In or Outdo nothing and alert
      console.error(
        `ALERT a care that didn't enter when out or no direction specified ${this.log.direction}`
      );
      throw new Error();
    } catch (error) {
      console.error(error);
      throw new Error(error);
    } finally {
      this.db.close();
      console.log("db closed");
    }
  }

  /**
   * This function is used to check if the car is allowed
   * @returns Boolean
   */
  async #seeIfCarIsAllowed() {
    try {
      const carAllowed = await this.webhookQueries.seeIfCarAllowed(
        this.log.data_source_cam_id,
        this.log.plate_number
      );
      console.log(carAllowed);
      return carAllowed;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  /**
   *
   * @returns Object with the necessary data to be inserted into the cameraLogs table
   */
  #logFormatter() {
    return {
      data_source_cam_id: this.webhook.camera_id,
      log_time: new Date(this.webhook.epoch_start),
      plate_number: this.webhook.best_plate.plate,
      car_color: this.webhook.vehicle.color[0].name,
      car_make: this.webhook.vehicle.make[0].name,
      car_model: this.webhook.vehicle.make_model[0].name,
      car_type: this.webhook.vehicle.body_type[0].name,
      car_year: this.webhook.vehicle.year[0].name,
      vehicle_pic: Buffer.from(this.webhook.vehicle_crop_jpeg, "base64"),
      plate_pic: Buffer.from(this.webhook.best_plate.plate_crop_jpeg, "base64"),
      direction:
        this.webhook.direction_of_travel_id == 0
          ? "In"
          : this.webhook.direction_of_travel_id == 1
          ? "Out"
          : this.webhook.travel_direction,
    };
  }

  /**
   * This function is used to set the Log as archive
   */
  #setLogAsArchive() {
    this.log.archive = true;
  }

  /**
   * This function is used to insert the log into the database
   */
  async #insertLog() {
    try {
      await this.webhookQueries.insertCameraLog(this.log);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export default Log;
