const operatorService = {
  getAllOperators(knex) {
    return knex.select("*").from("operators");
  },
  insertOperator(knex, newoperator) {
    return knex
      .insert(newoperator)
      .into("operators")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("operators")
      .select("*")
      .where("id", id)
      .first();
  },
  getByOperatorName(knex, operatorName) {
    return knex
      .from("operators")
      .select("*")
      .where("name", operatorName)
      .first();
  },
  deleteOperator(knex, id) {
    return knex("operators")
      .where({ id })
      .delete();
  },
  updateOperator(knex, id, newoperatorFields) {
    return knex("operators")
      .where({ id })
      .update(newoperatorFields);
  }
};

module.exports = operatorService;
