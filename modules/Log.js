import Database from "../controllers/db.js";
import WebhookQueries from "../queries/webhookQueries.js";
import * as fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

/**
 * This class is representing a the OPENALPR webhook POST request
 * And is used to handle the camera logs
 */
class Log {
  constructor(webhook) {
    this.db = new Database();
    this.webhookQueries = new WebhookQueries(this.db);
    this.webhook = webhook;
    this.log = this.#formattedLog();
    this.__Dirname = dirname(fileURLToPath(import.meta.url));
    this.picFolder = "pics";
  }

  /**
   * This Is the main function of the class
   */
  async handelCameraLog() {
    try {
      const AllowedIdAndHasPic = await this.#IfCarIsAllowedID();
      //? if allowed insert log as archive
      //? if has pic insert pic in unit_cars
      if (AllowedIdAndHasPic && AllowedIdAndHasPic.car_id) {
        if (AllowedIdAndHasPic.has_pic) {
          this.webhookQueries.insertCarPicture(
            this.log.vehicle_pic,
            AllowedIdAndHasPic.car_id
          );
        }
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
    }
  }

  /**
   * This function is used to check if the car is allowed
   * @returns Boolean
   */
  async #IfCarIsAllowedID() {
    try {
      const carAllowed = await this.webhookQueries.seeIfCarAllowed(
        this.log.data_source_cam_id,
        this.log.plate_number
      );
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
  #formattedLog() {
    return {
      data_source_cam_id: this.webhook.camera_id,
      log_time: new Date(this.webhook.epoch_start),
      plate_number: this.webhook.best_plate.plate.toLowerCase(),
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
   * Handles the saving of vehicle and plate pictures for the log entry.
   */
  handelPics() {
    const filePath = path.join(this.__Dirname, this.picFolder);
    let carImagePath = path.join(
      this.picFolder,
      `car${this.log.plate_number}${Date.now()}.jpg`
    );
    let plateImagePath = path.join(
      this.picFolder,
      `plate${this.log.plate_number}${Date.now()}.jpg`
    );
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    if (this.log.vehicle_pic) {
      fs.writeFileSync(
        path.join(this.__Dirname, carImagePath),
        this.log.vehicle_pic
      );
    }

    if (this.log.plate_pic) {
      fs.writeFileSync(
        path.join(this.__Dirname, plateImagePath),
        this.log.plate_pic
      );
    }

    this.log.vehicle_pic = carImagePath;
    this.log.plate_pic = plateImagePath;
  }
  /**
   * This function is used to insert the log into the database
   */
  async #insertLog() {
    try {
      this.handelPics();
      await this.webhookQueries.insertCameraLog(this.log);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export default Log;
