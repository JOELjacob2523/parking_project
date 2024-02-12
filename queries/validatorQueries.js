import Database from "../controllers/db.js";

class ValidatorQueries {
  constructor() {
    this.db = new Database();
  }

  async EmailExist(email, uptRcId) {
    let query = this.db.knex("users").where("email", email);

    if (uptRcId !== undefined) {
      query = query.andWhere("user_id", "<>", Number(uptRcId));
    }

    const result = await query.first();

    return result !== undefined;
  }

  async PhoneExist(phone, uptRcId) {
    let query = this.db.knex("users").where(function () {
      this.where("phone_number_main", phone).orWhere("phone_number_2", phone);
    });

    if (uptRcId !== undefined) {
      query = query.andWhere("user_id", "<>", Number(uptRcId));
    }

    const result = await query.first();

    return result !== undefined;
  }

  async isCarInLockedLot(plateNumber) {
    const result = await this.db
      .knex("cameralogs")
      .join(
        "cameras",
        "cameralogs.data_source_cam_id",
        "cameras.Data_source_camera_id"
      )
      .join("lots", "cameras.lot_id", "lots.lot_id")
      .where("cameralogs.plate_number", plateNumber)
      .orderBy("cameralogs.log_id", "desc")
      .limit(1)
      .select(
        this.db.knex.raw(
          "lots.locked AND cameralogs.direction = 'In' as in_locked_lot"
        )
      );
    return result[0] ? result[0].in_locked_lot : 0;
  }

  async CameraExist(id, uptRcId) {
    let query = this.db.knex("cameras").where("Data_source_camera_id", id);

    if (uptRcId !== undefined) {
      query = query.whereNot("camera_id", uptRcId);
    }

    const result = await query.first();

    return result !== undefined;
  }

  async getUsersIdNameByCondoId(adminId) {
    const res = await this.db.knex("users").where("created_by", adminId);

    const arr = res.map((item) => {
      return {
        value: item.user_id,
        label: item.email,
      };
    });

    return arr;
  }

  async getCondoIdAddressByAdminId(adminId) {
    const res = await this.db
      .knex("condos")
      .select("condos.condo_id", "condos.condo_address")
      .where({ condo_admin_id: adminId });

    const arr = res.map((item) => {
      return {
        value: item.condo_id,
        label: item.condo_address,
      };
    });

    return arr;
  }
}

export default ValidatorQueries;
