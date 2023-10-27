import WebhookQueries from "../controllers/webhookQueries.js";

class WebhookUtilities {
  constructor() {
    this.webhookQueries = new WebhookQueries();
  }

  async handelCameraLog(log) {
    try {
      const formattedLog = await this.#formatReqBodyCamLogs(log);
      const isAllowed = await this.#seeIfCarIsAllowed(
        formattedLog.plate_number,
        formattedLog.data_source_cam_id
      );
      //? if allowed insert log as archive
      if (isAllowed) {
        await this.#insertLogAsArchive(formattedLog);
        return;
      }
      //? if not allowed see if car is in logs
      const duplicateLog = await this.webhookQueries.getDuplicateLogNotArchived(
        formattedLog.plate_number
      );
      //? if car is in logs
      if (duplicateLog.length > 0) {
        //? if current log is in delete the duplicate log and insert the current log
        if (formattedLog.direction == "In") {
          this.webhookQueries.deleteLog(duplicateLog[0].log_id);
          this.webhookQueries.insertCameraLog(formattedLog);
          return;
        }
        //? if current log is out set logs as archive and insert the current log
        else if (formattedLog.direction == "Out") {
          this.webhookQueries.setLogAsArchive(duplicateLog[0].log_id);
          this.#insertLogAsArchive(formattedLog);
          return;
        }
      }
      //? if car is not in logs and Not Allowed insert the current log if it is in insert log
      if (formattedLog.direction == "In") {
        this.webhookQueries.insertCameraLog(formattedLog);
        return;
      }
      //? if car is not in logs and direction is out
      //? or direction is not In or Outdo nothing and alert
      console.error(
        "ALERT a care that didn't enter when out or no direction specified"
      );
      return;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async #insertLogAsArchive(log) {
    log.archive = true;
    await this.webhookQueries.insertCameraLog(log);
  }

  async #seeIfCarIsAllowed(plateNumber, camId) {
    const camIdList = await this.webhookQueries.getDataSourcesIdForAllowedCar(
      camId,
      plateNumber
    );
    if (camIdList.length > 0) {
      console.log("Car is allowed");
      return true;
    }
    console.log("Car is not allowed");
    return false;
  }

  async #formatReqBodyCamLogs(reqBod) {
    const {
      camera_id,
      epoch_start,
      best_plate,
      vehicle_crop_jpeg,
      vehicle,
      travel_direction,
      direction_of_travel_id,
    } = reqBod;
    const { plate, plate_crop_jpeg } = best_plate;
    const { color, make, make_model, body_type, year } = vehicle;
    let direction = this.#setDirection(
      direction_of_travel_id,
      travel_direction
    );

    return {
      data_source_cam_id: camera_id,
      log_time: new Date(epoch_start),
      plate_number: plate,
      car_color: color[0].name,
      car_make: make[0].name,
      car_model: make_model[0].name,
      car_type: body_type[0].name,
      car_year: year[0].name,
      vehicle_pic: Buffer.from(vehicle_crop_jpeg, "base64"),
      plate_pic: Buffer.from(plate_crop_jpeg, "base64"),
      direction: direction,
    };
  }

  #setDirection(direction_of_travel_id, travel_direction) {
    if (direction_of_travel_id == 0) {
      return "In";
    } else if (direction_of_travel_id == 1) {
      return "Out";
    }
    return travel_direction;
  }
}

export default WebhookUtilities;
