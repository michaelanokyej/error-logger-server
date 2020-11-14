const operationsService = {
  getAllOperations(knex) {
    return knex.select("*").from("operations");
    // return knex.raw("select p.id, p.poller_name, p.description, count(*) as poller_errors from operations p inner join errors e on p.id = e.poller_id group by p.id").then(results => {
    //     return results.rows;
    //   });
  },
  getAllOperationsAndErrors(knex) {
    // return knex.raw("select o.id as operation_id, o.operation_name, o.description, count(*) as operation_errors from operations o inner join errors e on o.id = e.operation_id group by o.id").then(results => {
    return knex.raw("select o.id as operation_id, o.operation_name, o.description, count(*) as operation_errors from operations o inner join errors e on o.id = e.operation_id AND e.is_fixed = false group by o.id").then(results => {
      return results.rows;
    });
  },
  insertOperation(knex, newOperation) {
    return knex
      .insert(newOperation)
      .into("operations")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("operations")
      .select("*")
      .where("id", id)
      .first();
  },
  getByOperationname(knex, operationName) {
    return knex
      .from("operations")
      .select("*")
      .where("poller_name", operationName)
      .first();
  },
  deleteOperation(knex, id) {
    return knex("operations")
      .where({ id })
      .delete();
  },
  updateOperation(knex, id, newOperationFields) {
    return knex("operations")
      .where({ id })
      .update(newOperationFields);
  }
};

module.exports = operationsService;
