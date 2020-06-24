const pollerService = {
  getAllPollers(knex) {
    return knex.select("*").from("pollers");
    // return knex.raw("select p.id, p.poller_name, p.description, count(*) as poller_errors from pollers p inner join errors e on p.id = e.poller_id group by p.id").then(results => {
    //     return results.rows;
    //   });
  },
  getAllPollersAndErrors(knex) {
    return knex.raw("select p.id, p.poller_name, p.description, count(*) as poller_errors from pollers p inner join errors e on p.id = e.poller_id group by p.id").then(results => {
        return results.rows;
      });
  },
  insertPoller(knex, newPoller) {
    return knex
      .insert(newPoller)
      .into("pollers")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("pollers")
      .select("*")
      .where("id", id)
      .first();
  },
  getByPollername(knex, pollername) {
    return knex
      .from("pollers")
      .select("*")
      .where("poller_name", pollername)
      .first();
  },
  deletePoller(knex, id) {
    return knex("pollers")
      .where({ id })
      .delete();
  },
  updatePoller(knex, id, newPollerFields) {
    return knex("pollers")
      .where({ id })
      .update(newPollerFields);
  }
};

module.exports = pollerService;
