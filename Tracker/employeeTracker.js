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
          return updateEmployeeRole();
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

// ADD MANAGER TO EMPLOYEE - pull list of employees entered into system, list them as choices
// const addManager = () => {
//   inquirer.prompt({
//     type: "list",
//     name: "manager",
//     message: "Who is this employee's manager?",
//     choices: [],
//   });
// };

// UPDATE EMPLOYEE ROLE - Pull employee info from SQL
// const updateEmployeeRole = () => {
//   inquirer.prompt({
//     type: "list",
//     name: "newRole",
//     message: "What employee's role would you like to update? ",
//     choices: function choices() {
//       connection.query(
//         "Select first_name FROM employeeInfo",
//         (err, res) => {
//           if (err) throw err;
//         },
//         {
//           type: "list",
//           name: "roleSelection",
//           message: "What role would you like to assign?",
//           choices: [
//             "Sales Lead",
//             "Lead Engineer",
//             "Salesperson",
//             "Software Engineer",
//             "Accountant",
//             "Legal Team Lead",
//             "Lawyer",
//             "Lead Engineer",
//           ],
//         }
//       );
//     },
//   });
// };

// const removeEmployee = () => {};

//
// const employeeRole = () => {
//   connection.query("SELECT title FROM roles", (err, res) => {
//     if (err) throw err;
//     console.table(res);
//   });
// };

connection.connect((err) => {
  if (err) throw err;
  mainQuestion();
});
