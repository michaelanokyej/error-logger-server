-- DROP the table and constraints
DROP TABLE IF EXISTS tasks;


-- create the pollers table, it depends on no other
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  task_name VARCHAR NOT NULL,
  description VARCHAR,
  UNIQUE (task_name)
);

ALTER TABLE errors
ADD COLUMN is_fixed BOOLEAN DEFAULT false, ADD COLUMN category TEXT NOT NULL;



  -- is_fixed BOOLEAN DEFAULT false,