import Database from "./db.js";

class UserQueries {
  constructor() {
    this.db = new Database();
  }

  async getUserProfile(userId) {
    return await this.db.knex("users").select("*").where({ user_id: userId });
  }

  async getUnitsOfUser(userId) {
    return await this.db.knex("units")
      .select("unit_id", "address", "condo_id", "max_cars")
      .where({ user_id: userId });
  }

  async getUnitAddressCarListAndMaxCars(unitid) {
    return await this.db.knex("units")
      .select("unit_id", "address", "car_list", "max_cars")
      .where({ unit_id: unitid });
  }

  async updateUserProfile(userId, user) {
    const updateDate = new Date();
    user.last_update = updateDate;
    return await this.db.knex("users").where({ user_id: userId }).update(user);
  }

  async updateUnitPlateList(unitId, plateList) {
    const list = JSON.stringify(plateList);
    return await this.db.knex("units")
      .where({ unit_id: unitId })
      .update({ car_list: list });
  }
}

export default UserQueries;
