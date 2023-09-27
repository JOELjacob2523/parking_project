const { knex } = require("./db");

module.exports = {
  createUser,
  createCondo,
  createLot,
  createUnit,
  createCamera,
  getMaxCarsOfCondo,
  getCondos,
  getCondoById,
  getLotsByCondoId,
  getLotById,
  getUsers,
  getUserById,
  getCondoUsers,
  getAllLogs,
  getLogsByCondoId,
};

async function createUser(user) {
  return await knex("users").insert(user);
}

async function createCondo(condo) {
  return await knex("condos").insert(condo);
}

async function createLot(lot) {
  return await knex("lots").insert(lot);
}

async function createUnit(unit) {
  return await knex("units").insert(unit);
}

async function createCamera(camera) {
  return await knex("cameras").insert(camera);
}

async function getMaxCarsOfCondo(condoId) {
  return await knex("condos").select("max_cars").where({ condo_id: condoId });
}


// get condos joined with users for the condo admin and only select the username
async function getCondos() {
  return await knex("condos")
    .join("users", "condos.condo_admin_id", "=", "users.user_id")
    .select("condos.*", "users.username as condo_admin_username");
}

async function getCondoById(condoId) {
  return await knex("condos").select("*").where({ condo_id: condoId });
}

async function getLotsByCondoId(condoId) {
  return await knex("lots").select("*").where({ condo_id: condoId });
}

async function getLotById(lotId) {
  return await knex("lots").select("*").where({ lot_id: lotId });
}

async function getUsers() {
  return await knex("users").select("*");
}

async function getUserById(userId) {
  return await knex("users").select("*").where({ user_id: userId });
}

async function getCondoUsers(condoId) {
  return await knex("users")
    .join("units", "users.user_id", "=", "units.user_id")
    .join("condos", "units.condo_id", "=", "condos.condo_id")
    .where("condos.condo_id", condoId)
    .select(
      "users.user_id",
      "users.username",
      "users.password",
      "users.phone_number_main",
      "users.is_active",
      "users.user_role",
      "units.unit_id",
      "units.unit as unit_number"
    );
}

async function getAllLogs() {
  return await knex("cameralogs")
    .where("completion_state", false)
    .where("archive", true)
    .select("*");
}

async function getLogsByCondoId(condoId, archive = true) {
  return await knex("cameralogs")
    .join(
      "cameras",
      "cameralogs.data_source_cam_id",
      "=",
      "cameras.Data_source_camera_id"
    )
    .join("lots", "cameras.lot_id", "=", "lots.lot_id")
    .join("condos", "lots.condo_id", "=", "condos.condo_id")
    .where("condos.condo_id", condoId)
    .where("cameralogs.archive", archive)
    .select("*");
}
