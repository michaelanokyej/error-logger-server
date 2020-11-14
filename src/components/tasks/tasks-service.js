const taskService = {
  getAllTasks(knex) {
    return knex.select("*").from("tasks");
    // return knex.raw("select p.id, p.task_name, p.description, count(*) as task_errors from tasks p inner join errors e on p.id = e.task_id group by p.id").then(results => {
    //     return results.rows;
    //   });
  },
  getAllTasksAndErrors(knex) {
    return knex.raw("select t.id, t.task_name, t.description, count(*) as task_errors from tasks t inner join errors e on t.id = e.task_id group by t.id").then(results => {
        return results.rows;
      });
  },
  insertTask(knex, newtask) {
    return knex
      .insert(newtask)
      .into("tasks")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("tasks")
      .select("*")
      .where("id", id)
      .first();
  },
  getByTaskname(knex, taskname) {
    return knex
      .from("tasks")
      .select("*")
      .where("task_name", taskname)
      .first();
  },
  deleteTask(knex, id) {
    return knex("tasks")
      .where({ id })
      .delete();
  },
  updateTask(knex, id, newtaskFields) {
    return knex("tasks")
      .where({ id })
      .update(newtaskFields);
  }
};

module.exports = taskService;
