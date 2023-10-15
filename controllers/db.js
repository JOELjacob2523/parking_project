// import Knex from "knex";
// import dotenv from "dotenv";

// dotenv.config();

// const knex = Knex({
//   client: "mysql",
//   connection: {
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//   },
// });

// export default knex;

import Knex from "knex";
import dotenv from "dotenv";

dotenv.config();

class Database {
  constructor() {
    this.knex = Knex({
      client: "mysql",
      connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      },
    });
  }

  async query(sql, params) {
    return await this.knex.raw(sql, params);
  }

  async close() {
    return await this.knex.destroy();
  }
}

export default Database;