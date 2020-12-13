const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
const figlet = require("figlet");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Blink182!",
  database: "employee_trackerDB",
});

// EMPLOYEE TRACKER Display
figlet("EMPLOYEE MANAGER", function (err, data) {
  if (err) throw err;
  console.log(data);
});

// MAIN QUESTIONS - Need to add manager?

const mainQuestion = () => {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "Add Employee",
        // "Remove Employee",
        "View All Employees",
        "Update Employee Role",
        "View Departments",
        "View All Employees",
        "EXIT",
      ],
    })
    .then(({ task }) => {
      switch (task) {
        case "Add Employee":
          return addEmployee();
        // case "Remove Employee":
        //   return removeEmployee();
        case "View All Employees":
          return viewAllEmployees();
        case "Update Employee Role":
          return employeeRole();
        case "View Departments":
          return viewDepartments();
        case "View All Employees":
          return viewAll();
        case "EXIT":
          connection.end();
      }
    });
};

// CHECKED - Add employee to EMPLOYEE INFO TABLE

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      // {
      //   type: "list",
      //   name: "department",
      //   message: "What department is the employee in?",
      //   choices: [],
      // },
      {
        type: "list",
        name: "emp_role",
        message: "What is the role of the employee?",
        choices: [
          "Sales Lead",
          "Lead Engineer",
          "Salesperson",
          "Software Engineer",
          "Accountant",
          "Legal Team Lead",
          "Lawyer",
          "Lead Engineer",
        ],
      },
      // {
      //   type: "rawlist",
      //   name: "manager",
      //   // choices() {
      //   //   const allManagers = []; //empty array we push the name of managers.
      //   //   res.forEach(({ first_name }) => {
      //   //     managerArray.push(first_name);
      //   //   });
      //   //   return managerArray;
      //   // },
      //   message: "Who is the employee's manager?"
      // },
    ])
    .then(({ first_name, last_name, emp_role }) => {
      connection.query(
        "INSERT INTO employeeInfo SET ?",
        {
          first_name,
          last_name,
          emp_role,
          // manager,
        },
        (err) => {
          if (err) throw err;
          console.log(
            `Employee Info: ${first_name} , ${last_name}, ${emp_role}`
          );
          mainQuestion();
        }
      );
    });
};

// CHECKED - VIEW ALL Employee's from EMPLOYEE info table.
const viewAllEmployees = () => {
  connection.query("SELECT * FROM employeeInfo", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainQuestion();
  });
};

// CHECKED - VIEW ALL departments
const viewDepartments = () => {
  connection.query("SELECT dept_name FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainQuestion();
  });
};

const removeEmployee = () => {};

const employeeRole = () => {};

connection.connect((err) => {
  if (err) throw err;
  mainQuestion();
});
