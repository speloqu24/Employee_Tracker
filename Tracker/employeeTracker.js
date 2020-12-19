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

// Fun employee manager display
figlet("EMPLOYEE MANAGER", function (err, data) {
  if (err) throw err;
  console.log(data);
});

// Main question function, asking user what they'd like to do in this application.
const mainQuestion = () => {
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "Add Employee",
        "Add Role",
        "Add Department",
        "View All Employees",
        "View Roles",
        "View Departments",
        "Update Employee Role",
        "Remove Employee",
        // Update Employee Manager
        "EXIT",
      ],
    })
    .then(({ task }) => {
      switch (task) {
        case "Add Employee":
          return addEmployee();
        case "Update Employee Role":
          return updateEmployee();
        case "View All Employees":
          return viewAllEmployees();
        case "Add Department":
          return addDepartment();
        case "Add Role":
          return addRole();
        case "View Roles":
          return viewRole();
        case "View Departments":
          return viewDepartments();
        case "Remove Employee":
          return removeEmployee();
        case "EXIT":
          connection.end();
      }
    });
};

//Add an employee to EMPLOYEE table in database
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
  });
};

//Add a new role to an employee with title, salary and department information.
const addRole = () => {
  connection.query("SELECT id, dept_name FROM departments", (err, res) => {
    if (err) throw err;
    const deptArr = res.map((deptIt) => {
      return {
        name: deptIt.dept_name,
        value: deptIt.id,
      };
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

// Add a new department to the database
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

// View all Employees info including manager info
const viewAllEmployees = () => {
  connection.query(
    "SELECT e.id, e.first_name, e.last_name, title, salary, dept_name, CONCAT(m.first_name, ' ', m.last_name) AS 'Manager' FROM employeeInfo e LEFT JOIN employeeInfo m ON m.id = e.manager_id LEFT JOIN roles ON e.roles_Id = (roles.Id) LEFT JOIN departments ON roles.department_id = (departments.Id) ORDER by e.id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      mainQuestion();
    }
  );
};

// View all the roles currently in the database
const viewRole = () => {
  connection.query("SELECT title, salary FROM roles", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainQuestion();
  });
};

// View all departments currently in database
const viewDepartments = () => {
  connection.query("SELECT dept_name FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    mainQuestion();
  });
};

// Update current Employee's role in database
const updateEmployee = () => {
  connection.query(
    "SELECT id, first_name, last_name FROM employeeInfo",
    (err, res) => {
      if (err) throw err;
      const empArr = res.map((empIt) => {
        return {
          name: empIt.first_name + " " + empIt.last_name,
          value: empIt.id,
        };
      });

      connection.query("SELECT id, title FROM roles", (error, response) => {
        if (error) throw error;
        const newRolesArr = response.map((roleIt) => {
          return {
            name: roleIt.title,
            value: roleIt.id,
          };
        });

        inquirer
          .prompt([
            {
              type: "list",
              name: "id",
              message: "What employee's role would you like to change?",
              choices: empArr,
            },
            {
              type: "list",
              name: "roles_id",
              message: "Select an New role for this employee",
              choices: newRolesArr,
            },
          ])
          .then(({ id, roles_id }) =>
            connection.query(
              "UPDATE employeeInfo SET roles_id = ? WHERE id = ?",
              // update role SET role_id WHERE employee_name
              [roles_id, id],
              (err) => {
                if (err) throw err;
                console.log("Your employee's role has been updated!");
                mainQuestion();
              }
            )
          );
      });
    }
  );
};

// Remove employee from database
const removeEmployee = () => {
  connection.query(
    "SELECT id, first_name, last_name FROM employeeInfo",
    (err, res) => {
      if (err) throw err;
      const empArr = res.map((empIt) => {
        return {
          name: empIt.first_name + " " + empIt.last_name,
          value: empIt.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "id",
            message: "Which employee would you like to remove?",
            choices: empArr,
          },
        ])
        .then(({ id }) => {
          connection.query(
            "DELETE FROM employeeInfo WHERE id = ?",
            [id],
            (err) => {
              if (err) throw err;
              console.log(`Employee has been removed!`);
              mainQuestion();
            }
          );
        });
    }
  );
};

connection.connect((err) => {
  if (err) throw err;
  mainQuestion();
});
