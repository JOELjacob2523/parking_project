import WebhookQueries from "../controllers/webhookQueries.js";

class WebhookUtilities {
  constructor() {
    this.webhookQueries = new WebhookQueries();
  }

  async handelCameraLog(log) {
    try {
      const formattedLog = this.#formatReqBodyCamLogs(log);
      const isAllowed = await this.webhookQueries.seeIfCarIsAllowed(
        formattedLog.plate_number,
        formattedLog.data_source_cam_id
      );
      if (isAllowed) {
        formattedLog.archive = true;
        this.webhookQueries.insertCameraLog(formattedLog);
        return;
      }
      const duplicateLog =
        await this.webhookQueries.getLogForPlateIfExistsInLogs(
          formattedLog.plate_number
        );
      if (duplicateLog.length > 0) {
        if (formattedLog.direction == "In") {
          this.webhookQueries.deleteLog(duplicateLog[0].log_id);
          this.webhookQueries.insertCameraLog(formattedLog);
          return;
        } else {
          this.webhookQueries.setLogAsArchive(duplicateLog[0].log_id);
          formattedLog.archive = true;
          this.webhookQueries.insertCameraLog(formattedLog);
        }
      } else {
        if (formattedLog.direction == "In") {
          this.webhookQueries.insertCameraLog(formattedLog);
          return;
        } else {
          console.log(
            "ALERT a care that didn't enter when out or no direction specified"
          );
          return;
        }
      }
    } catch (error) {
      console.trace(error);
      throw new Error(error);
    }
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
    console.log("direction", direction);
    console.log("cam id", camera_id);
    console.log("plate", plate);

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

  async #setDirection(direction_of_travel_id, travel_direction) {
    if (direction_of_travel_id == 0) {
      return "In";
    } else if (direction_of_travel_id == 1) {
      return "Out";
    }
    return travel_direction;
  }
}

export default WebhookUtilities;
