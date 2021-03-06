-- DROP the tables and constraints
DROP TABLE IF EXISTS errors;
DROP TABLE IF EXISTS operators;
DROP TABLE IF EXISTS operations;


-- create the operations table, it depends on no other
CREATE TABLE operations (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  operation_name VARCHAR NOT NULL,
  category TEXT NOT NULL,
  description VARCHAR,
  UNIQUE (operation_name)
);

-- create the operators table with the foreign key
CREATE TABLE operators (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT NOT NULL,
  UNIQUE (username)
);

-- create the errors table with the foreign key
CREATE TABLE errors (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  operator_id INTEGER REFERENCES operators(id) ON DELETE CASCADE,
  error_description VARCHAR NOT NULL,
  is_fixed BOOLEAN DEFAULT false,
  operation_id INTEGER REFERENCES operations(id) ON DELETE CASCADE,
  posted TIMESTAMP DEFAULT NOW()
);