const { knex } = require("./db");

module.exports = {
    getCondoByAdminId,
};

async function getCondoByAdminId(adminId) {
    return await knex("condos").select("*").where({ condo_admin_id: adminId });
}

