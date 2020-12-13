DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30) NULL
);


CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL (10,2) NOT NULL,
  department_id INT NOT NULL
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

INSERT INTO departments (dept_name)
VALUES ("Sales"),("Engineering"),("Accounting"), ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 1000000, 1),("Lead Engineer", 200000,2),("Salesperson", 80000,3), ("Software Engineer", 150000,4),("Accountant", 70000, 5),("Legal Team Lead", 65000,6),("Lawyer", 90000, 7);

-- INSERT into employeeInfo (first_name, last_name, roles_id, manager_id)


SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employeeInfo;