-- DROP the tasks table and is_fixed column in errors table
DROP TABLE IF EXISTS tasks;

ALTER TABLE errors
DROP COLUMN is_fixed;
