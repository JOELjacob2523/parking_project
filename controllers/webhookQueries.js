const { knex } = require("./db");

module.exports = {
  insertCameraLog,
  seeIfCarIsAllowed,
  getLogForPlateIfExistsInLogs,
  deleteLog,
  setLogAsArchive,
};

async function insertCameraLog(log) {
  return await knex("cameralogs").insert(log);
}


/**
 *
 * @param {String} plateNumber
 * @param {Number} camId
 * @returns `Boolean` if car is allowed True if Not False
 */
async function seeIfCarIsAllowed(plateNumber, camId) {
  const carList = await knex("units")
    .innerJoin("lots", "units.condo_id", "lots.condo_id")
    .innerJoin("cameras", "lots.lot_id", "cameras.lot_id")
    .where("Data_source_camera_id", camId)
    .whereRaw(`JSON_CONTAINS(units.car_list->"$.list", '"${plateNumber}"','$')`)
    .select("units.unit_id", "units.car_list");
  return carList.length == 0 ? false : true;
}

async function deleteLog(id) {
  return await knex("cameralogs").where("log_id", id).del();
}

async function getLogForPlateIfExistsInLogs(plateNumber) {
  return await knex("cameralogs")
    .where("plate_number", plateNumber)
    .where("completion_state", false)
    .where("archive", false)
    .select("*");
}

async function setLogAsArchive(id) {
  return await knex("cameralogs").where("log_id", id).update({ archive: true });
}
