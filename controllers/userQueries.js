const { knex } = require("./db");

module.exports = {
  getUserProfile,
  getUnitsOfUserWithCondoInfo,
  updateUserProfile,
  updateUnitPlateList,
};

async function getUserProfile(userId) {
  return await knex("users").select("*").where({ user_id: userId });
}

async function getUnitsOfUserWithCondoInfo(userId) {
  return await knex("units")
    .select("*")
    .join("condos", "units.condo_id", "=", "condos.condo_id")
    .where({ user_id: userId });
}

async function updateUserProfile(userId, user) {
  console.log(user);
  const updateDate = new Date();
  user.last_update = updateDate;
  console.log(user);
  return await knex("users").where({ user_id: userId }).update(user);
}

async function updateUnitPlateList(unitId, plateList) {
    const list = JSON.stringify(plateList);
  return await knex("units")
    .where({ unit_id: unitId })
    .update({ car_list: list });
}
