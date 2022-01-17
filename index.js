const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

const interfaceStart = () => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'initiationQuestion',
        message: 'What would you like to do?',
        choices: [
          'View All Employees',
          'View All Employees By Manager',
          'View All Roles',
          'View All Departments',
          'Add An Employee',
          'Add A Role',
          'Add A Department',
          'Update An Employee Role',
          'Update An Employee Manager'
        ]
      }
    ])
    .then(answers => {
      const answer = answers.initiationQuestion;
      if (answer == 'View All Employees') {
        viewEmployee();
      } else if (answer == 'View All Employees By Manager') {
        viewEmployeeByManager();
      } else if (answer == 'View All Roles') {
        viewRole();
      } else if (answer == 'View All Departments') {
        viewDepartment();
      } else if (answer == 'Add An Employee') {
        addEmployee();
      } else if (answer == 'Add A Role') {
        addRole();
      } else if (answer == 'Add A Department') {
        addDepartment();
      } else if (answer == 'Update An Employee Role') {
        updateEmployeeRole();
      } else if (answer == 'Update An Employee Manager') {
        updateEmployeeManager();
      }
    });
};

// continue more actions
const continueQuestion = () => {
  return inquirer
    .prompt(
      {
        type: 'list',
        name: 'continue',
        message: 'Continue?',
        choices: [
          'Yes',
          'No (Quit)'
        ]
      }
    )
    .then(answers => {
      const answer = answers.continue;
      if (answer == 'Yes') {
        interfaceStart();
      } else {
        process.exit();
      }
    });
};

// ----------------------------------  VIEW  ----------------------------------
// display department table
const viewDepartment = () => {
  db.query('SELECT * FROM department;', (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    continueQuestion();
  })
}

// display role table
const viewRole = () => {
  db.query(`SELECT employee_role.*,
              department.department_name AS department_name
            FROM employee_role
            LEFT JOIN department ON employee_role.department_id = department.id;`, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    continueQuestion();
  })
}

// display employee table
const viewEmployee = () => {
  db.query(`SELECT employee.id, employee.first_name, employee.last_name, employee_role.title,
              employee_role.salary, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
            FROM employee
            LEFT JOIN employee manager ON employee.manager_id = manager.id
            INNER JOIN employee_role ON employee.role_id = employee_role.id;`, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    continueQuestion();
  })
}

// display employee table ordered by manager
const viewEmployeeByManager = () => {
  db.query(`SELECT employee.id, employee.first_name, employee.last_name, employee_role.title,
              employee_role.salary, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
            FROM employee
            LEFT JOIN employee manager ON employee.manager_id = manager.id
            INNER JOIN employee_role ON employee.role_id = employee_role.id
            ORDER BY manager;`, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    continueQuestion();
  })
}

// -----------------------------------  ADD  ---------------------------------
// add department
const addDepartment = () => {
  return inquirer
    .prompt(
      {
        type: 'input',
        name: 'name',
        message: 'Please enter the name of the new department:',
        validate: nameInput => {
          if (nameInput.length <= 30) {
            return true;
          } else {
            console.log('Please enter no more than 30 characters');
            return false;
          };
        }
      }
    )
    .then(answer => {
      db.query(`INSERT INTO department (department_name) VALUES ('${answer.name}');`, (err, res) => {
        if (err) {
          console.log(err);
        }
        viewDepartment();
      });
    });
};

// add role
const addRole = () => {

  db.query("SELECT id, department_name FROM department ORDER BY department_name;", (err, res) => {
    if (err) {
      console.log(err);
    }
    const departmentIdArray = res.map((departments) => {
      return {
        name: departments.department_name,
        value: departments.id,
      };
    });

    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Please enter the title of the new role:',
          validate: titleInput => {
            if (titleInput.length <= 30) {
              return true;
            } else {
              console.log('Please enter no more than 30 characters');
              return false;
            };
          }
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Please enter the salary of the new role (without decimals, currency signs, commas, or spaces):',
          validate: salaryInput => {
            if (salaryInput % 1 == 0) {
              return true;
            } else {
              console.log('Please enter a whole number');
              return false;
            };
          }
        },
        {
          type: 'list',
          name: 'departmentId',
          message: "Select this role's department:",
          choices: departmentIdArray
        }
      ])
      .then(answers => {
        db.query(`INSERT INTO employee_role (title, salary, department_id) VALUES ('${answers.title}', ${answers.salary}, ${answers.departmentId});`, (err, res) => {
          if (err) {
            console.log(err);
          }
          viewRole();
        });
      });
  });
};

// add employee
const addEmployee = () => {

  db.query('SELECT id, title FROM employee_role ORDER BY title;', (err, res) => {
    if (err) {
      console.log(err);
    }
    const roleIdArray = res.map((roles) => {
      return {
        name: roles.title,
        value: roles.id,
      };
    });

    db.query('SELECT id, first_name, last_name FROM employee ORDER BY first_name;', (err, res) => {
      if (err) {
        console.log(err);
      }
      const managerIdArray = res.map((managers) => {
        return {
          name: managers.first_name + " " + managers.last_name,
          value: managers.id,
        };
      });

      return inquirer
        .prompt([
          {
            type: 'input',
            name: 'firstName',
            message: 'Please enter the first name of the new employee:',
            validate: firstNameInput => {
              if (firstNameInput.length <= 30) {
                return true;
              } else {
                console.log('Please enter no more than 30 characters');
                return false;
              };
            }
          },
          {
            type: 'input',
            name: 'lastName',
            message: 'Please enter the last name of the new employee:',
            validate: lastNameInput => {
              if (lastNameInput.length <= 30) {
                return true;
              } else {
                console.log('Please enter no more than 30 characters');
                return false;
              };
            }
          },
          {
            type: 'list',
            name: 'roleId',
            message: "Select this employee's role:",
            choices: roleIdArray
          },
          {
            type: 'list',
            name: 'managerId',
            message: "Select this employee's supervisor:",
            choices: managerIdArray
          }
        ])
        .then(answers => {
          db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}', '${answers.lastName}', ${answers.roleId}, ${answers.managerId});`, (err, res) => {
            if (err) {
              console.log(err);
            }
            viewEmployee();
          });
        });
    });
  });
};

// ---------------------------------------------------------------------------
// update employee role
const updateEmployeeRole = () => {

  db.query('SELECT id, title FROM employee_role ORDER BY title;', (err, res) => {
    if (err) {
      console.log(err);
    }
    const roleArray = res.map((roles) => {
      return {
        name: roles.title,
        value: roles.id,
      };
    });

    db.query('SELECT id, first_name, last_name FROM employee ORDER BY first_name;', (err, res) => {
      if (err) {
        console.log(err);
      }
      const employeeArray = res.map((employees) => {
        return {
          name: employees.first_name + " " + employees.last_name,
          value: employees.id,
        };
      });

      return inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: "Select the employee to be updated:",
            choices: employeeArray
          },
          {
            type: 'list',
            name: 'roleId',
            message: "Select this employee's new role:",
            choices: roleArray
          }
        ])
        .then(answers => {
          db.query(`UPDATE employee SET role_id = ${answers.roleId} WHERE id = ${answers.employeeId};`, (err, res) => {
            if (err) {
              console.log(err);
            }
            viewEmployee();
          });
        });
    });
  });
};

// update employee manager
const updateEmployeeManager = () => {

  db.query('SELECT id, first_name, last_name FROM employee ORDER BY first_name;', (err, res) => {
    if (err) {
      console.log(err);
    }
    const employeeArray = res.map((employees) => {
      return {
        name: employees.first_name + " " + employees.last_name,
        value: employees.id,
      };
    });
    const managerArray = employeeArray.concat({ name: 'None', value: '' });

    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: "Select the employee to be updated:",
          choices: employeeArray
        },
        {
          type: 'list',
          name: 'managerId',
          message: "Select this employee's new manager:",
          choices: managerArray
        }
      ])
      .then(answers => {
        db.query(`UPDATE employee SET manager_id = ${answers.managerId} WHERE id = ${answers.employeeId};`, (err, res) => {
          if (err) {
            console.log(err);
          }
          viewEmployee();
        });
      });
  });
};

// ---------------------------------------------------------------------------

interfaceStart();