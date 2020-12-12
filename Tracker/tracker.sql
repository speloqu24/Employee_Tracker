DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30) NULL
);


CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NULL,
  salary DECIMAL,
  department_id INT
);

CREATE TABLE employeeInfo (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(40) NOT NULL,
  last_name VARCHAR(40) NOT NULL, 
  emp_role VARCHAR(40) NOT NULL,
  roles_id INT,
  FOREIGN KEY (roles_id) REFERENCES roles(id),
--   FOREIGN KEY (role_id) REFERENCES role (id),
  manager_id INT
);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employeeInfo;