const {
  getMaxCarsOfCondo,
  createUnit,
} = require("../controllers/superAdminQueries");

module.exports = {
  createUnitList,
};

async function createUnitList(reqQuery) {
  try {
    const { condoId, amount } = reqQuery;
    let max_cars = await getMaxCarsOfCondo(condoId);
    max_cars = max_cars[0].max_cars;
    let unitArray = [];
    for (let i = 1; i <= amount; i++) {
      let unitInfo = {
        condo_id: condoId,
        max_cars: max_cars,
        unit: `bulk-${i}`,
      };
      unitArray.push(unitInfo);
    }
    await createUnit(unitArray);
  } catch (error) {
    throw new Error(error);
  }
}
