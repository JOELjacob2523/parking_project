import WebhookQueries from "../oop-controllers/webhookQueries";
// import {
//   seeIfCarIsAllowed,
//   getLogForPlateIfExistsInLogs,
//   deleteLog,
//   insertCameraLog,
//   setLogAsArchive,
// } from "../oop-controllers/webhookQueries";

/**
 * This function is used to handle the camera logs
 * To see where to place the log
 * @param {JSON} log
 * @returns Undefined
 */
module.exports = async function handelCameraLog(log) {
  try {
    const formattedLog = formatReqBodyCamLogs(log);
    const isAllowed = await seeIfCarIsAllowed(
      formattedLog.plate_number,
      formattedLog.data_source_cam_id
    );
    if (isAllowed) {
      formattedLog.archive = true;
      insertCameraLog(formattedLog);
      return;
    }
    const duplicateLog = await getLogForPlateIfExistsInLogs(
      formattedLog.plate_number
    );
    if (duplicateLog.length > 0) {
      if (formattedLog.direction == "In") {
        deleteLog(duplicateLog[0].log_id);
        insertCameraLog(formattedLog);
        return;
      } else {
        setLogAsArchive(duplicateLog[0].log_id);
        formattedLog.archive = true;
        insertCameraLog(formattedLog);
      }
    } else {
      if (formattedLog.direction == "In") {
        insertCameraLog(formattedLog);
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
};

/**
 * @param {JSON} reqBod
 * @returns Object with the necessary data to be inserted into the cameraLogs table
 */
function formatReqBodyCamLogs(reqBod) {
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
  let direction = setDirection(direction_of_travel_id, travel_direction);
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

/**
 * This function is used to set the direction of travel
 * Based on the direction_of_travel_id and travel_direction
 * @param {Number} direction_of_travel_id
 * @param {Number} travel_direction
 * @returns String with the direction of travel
 */
function setDirection(direction_of_travel_id, travel_direction) {
  if (direction_of_travel_id == 0) {
    return "In";
  } else if (direction_of_travel_id == 1) {
    return "Out";
  }
  return travel_direction;
}
