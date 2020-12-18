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

const mainQuestion = () => {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "Add Employee",
        // "Remove Employee",
        "Add Role",
        "Add Department",
        "View All Employees",
        // "Remove Employee",
        // "Update Employee Manager",
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
        case "Add Department":
          return addDepartment();
        case "Add Role":
          return addRole();
        case "View Departments":
          return viewDepartments();
        case "EXIT":
          connection.end();
      }
    });
};

// CHECKED - Add employee to EMPLOYEE INFO TABLE
// COMMENTED OUT MANAGER QUESTION
const addEmployee = () => {
  connection.query("SELECT id, title FROM roles", (err, res) => {
    if (err) throw err;
    // console.log(res);
    const rolesArr = res.map((rolesIt) => {
      return {
        name: rolesIt.title,
        value: rolesIt.id,
      };
    });
    // console.log(rolesArr);

    // ERROR THROWN, NO MANAGERS LISTED.
    // let manageList = [];
    connection.query(
      "SELECT id, first_name, last_name FROM employeeInfo",
      (error, response) => {
        if (error) throw error;
        // console.log(response);
        const manageList = response.map((manageIt) => {
          return {
            name: manageIt.first_name + " " + manageIt.last_name,
            value: manageIt.id,
          };
        });
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
              name: "roles_id",
              message: "What is the role of the employee?",
              choices: rolesArr,
            },
            {
              type: "list",
              name: "manager_id",
              message: "Who is the employee's manager?",
              choices: [...manageList, "None"],
              // What happens if there's no manager?
            },
          ])
          .then(({ first_name, last_name, roles_id, manager_id }) => {
            manager_id === "None"
              ? (manager_id = 0)
              : (manager_id = manager_id);
            connection.query(
              "INSERT INTO employeeInfo SET ?",
              {
                first_name,
                last_name,
                roles_id,
                manager_id,
              },
              (err) => {
                if (err) throw err;
                console.log(
                  `Added Employee Info: ${first_name} , ${last_name}, ${roles_id}, ${manager_id}`
                );
                mainQuestion();
              }
            );
          });
      }
    );
    // });
  });
};
//CHECKED - Add role with title, salary and department information.
const addRole = () => {
  connection.query("SELECT id, dept_name FROM departments", (err, res) => {
    if (err) throw err;
    const deptArr = res.map((deptIt) => {
      return {
        name: deptIt.dept_name,
        value: deptIt.id,
      };
      console.log(res);
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What role would you like to add?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of this position?",
        },
        {
          type: "list",
          name: "department_id",
          message: "What department would you like to assign this role to?",
          choices: deptArr,
        },
      ])
      .then(({ title, salary, department_id }) =>
        connection.query(
          "INSERT INTO roles SET ?",
          {
            title,
            salary,
            department_id,
          },
          (err) => {
            if (err) throw err;
            console.log(
              `Updated Role of ${title} has been added to ${department_id}`
            );
            mainQuestion();
          }
        )
      );
  });
};

// CHECKED - ADD Department

const addDepartment = () => {
  connection.query("SELECT id, dept_name FROM departments", (err, res) => {
    if (err) throw err;
    // console.log(res);
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "dept_name",
        message: "What department would you like to add?",
      },
    ])
    .then(({ dept_name }) =>
      connection.query(
        "INSERT INTO departments SET ?",
        {
          dept_name,
        },
        (err) => {
          if (err) throw err;
          console.log(`Department ${dept_name} has been added`);
          mainQuestion();
        }
      )
    );
};

// CHECKED - VIEW ALL Employee's from EMPLOYEE info table.
const viewAllEmployees = () => {
  connection.query(
    "SELECT employeeInfo.id, employeeInfo.first_name, employeeInfo.last_name, roles.title, roles.salary, departments.dept_name FROM departments RIGHT JOIN roles ON departments.id = roles.department_id RIGHT JOIN employeeInfo ON roles.id = employeeInfo.roles_id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainQuestion();
    }
  );
};

// CHECKED - VIEW ALL departments
const viewDepartments = () => {
  connection.query("SELECT dept_name FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainQuestion();
  });
};

// const updateRole = () => {
//   console.log("Updating employee Role");
//   const query = connection.query(
//     "UPDATE roles SET ? WHERE ?",
//     [
//       {
//         quantity: 100,
//       },
//       {
//         flavor: "Rocky Road",
//       },
//     ],
//     (err, res) => {
//       if (err) throw err;
//       console.log(`${res.affectedRows} products updated!\n`);
//       // Call deleteProduct AFTER the UPDATE completes
//       deleteProduct();
//     }
//   );

// logs the actual query being run
// console.log(query.sql);

// update role, add employee, remove employee DELETE ID

connection.connect((err) => {
  if (err) throw err;
  mainQuestion();
});
