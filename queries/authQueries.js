import Database from "../controllers/db.js";

class AuthQueries {
  constructor() {
    this.db = new Database();
  }

  async createNewUser(user, createdBy) {
    user.created_by = createdBy;
    return await this.db.knex("users").insert(user);
  }

  async seeIfPasswordIsNull(email) {
    const [user] = await this.db
      .knex("users")
      .where({ email })
      .select("password");
    return user.password == null;
  }

  async setPasswordInDB(email, password) {
    return await this.db
      .knex("users")
      .where({ email })
      .update({ password, is_active: true });
  }

  async findUserByEmail(email) {
    const [user] = await this.db
      .knex("users")
      .where({ email })
      .select("user_id", "email", "password", "is_active", "user_role");
    return user;
  }

  async seeIfEmailExists(email) {
    const [user] = await this.db.knex("users").where({ email });
    return user;
  }

  async setOTPInDB(email, otp) {
    const now = this.db.knex.fn.now();
    return await this.db
      .knex("users")
      .where({ email })
      .update({ otp, otp_created_at: now });
  }

  async getOTPFromDB(email) {
    return await this.db
      .knex("users")
      .where({ email })
      .select("otp", "otp_created_at");
  }

  async removeOTPFromDB(email) {
    await this.db
      .knex("users")
      .where({ email })
      .update({ otp: null, otp_created_at: null });
    return;
  }
}

export default AuthQueries;
