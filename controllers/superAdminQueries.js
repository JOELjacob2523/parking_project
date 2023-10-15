import Database from "./db.js";

class SuperAdminRoutes {
  constructor() {
    this.db = new Database();
  }

  async createUser(user) {
    return await this.db.knex("users").insert(user);
  }
  async createCondo(condo) {
    return await this.db.knex("condos").insert(condo);
  }

  async createLot(lot) {
    return await this.db.knex("lots").insert(lot);
  }

  async createUnit(unit) {
    return await this.db.knex("units").insert(unit);
  }

  async createCamera(camera) {
    return await this.db.knex("cameras").insert(camera);
  }

  async getMaxCarsOfCondo(condoId) {
    return await this.db.knex("condos").select("max_cars").where({ condo_id: condoId });
  }

  async getCondos() {
    return await this.db.knex("condos")
      .join("users", "condos.condo_admin_id", "=", "users.user_id")
      .select("condos.*", "users.username as condo_admin_username");
  }

  async getCondoById(condoId) {
    return await this.db.knex("condos").select("*").where({ condo_id: condoId });
  }

  async getLotsByCondoId(condoId) {
    return await this.db.knex("lots").select("*").where({ condo_id: condoId });
  }

  async getLotById(lotId) {
    return await this.db.knex("lots").select("*").where({ lot_id: lotId });
  }

  async getUsers() {
    return await this.db.knex("users").select("*");
  }

  async getUserById(userId) {
    return await this.db.knex("users").select("*").where({ user_id: userId });
  }

  async getCondoUsers(condoId) {
    return await this.db.knex("users")
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

  async getAllLogs() {
    return await this.db.knex("cameralogs")
      .where("completion_state", false)
      .where("archive", true)
      .select("*");
  }

  async getLogsByCondoId(condoId, archive = true) {
    return await this.db.knex("cameralogs")
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
}

export default SuperAdminRoutes;
