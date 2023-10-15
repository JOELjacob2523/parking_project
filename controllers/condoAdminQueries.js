import Database from "./db.js";

class CondoAdminQueries {
  constructor() {
    this.db = new Database();
  }
  async getCondoByAdminId(adminId) {
    return await this.db.knex("condos").select("*").where({ condo_admin_id: adminId });
  }
}

export default CondoAdminQueries;
