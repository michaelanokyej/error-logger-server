const errorService = {
  getAllErrors(knex) {
    return knex.select("*").from("errors").orderBy("id", "desc");
  },
  getAllErrorsAndOperations(knex) {
    return knex.raw("select e.id as error_id, * from errors e inner join operations o on e.operation_id = o.id order by error_id desc").then(results => {
        return results.rows;
      });
      // order by e.posted desc
  },
  insertError(knex, newerror) {
    return knex
      .insert(newerror)
      .into("errors")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from("errors").select("*").where("id", id).first();
  },
  getByErrorname(knex, errorname) {
    return knex
      .from("errors")
      .select("*")
      .where("error_name", errorname)
      .first();
  },
  deleteError(knex, id) {
    return knex("errors").where({ id }).delete();
  },
  updateError(knex, id, newerrorFields) {
    return knex("errors").where({ id }).update(newerrorFields);
  },
};

module.exports = errorService;
