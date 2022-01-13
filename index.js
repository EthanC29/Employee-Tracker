const inquirer = require('inquirer');
const mysql = require('mysql2');
const { addDepartment } = require('./lib/addDepartment');
const { addEmployee, updateEmployeeRole, updateEmployeeManager } = require('./lib/addEmployee');
const { addRole } = require('./lib/addRole');
const { viewDepartments } = require('./lib/viewDepartment');
const { viewEmployees, viewEmployeesByManager } = require('./lib/viewEmployee');
const { viewRoles } = require('./lib/viewRole');

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
  .prompt(
    {
      type: 'list',
      name: 'initiationQuestion',
      message: 'What would you like to do?',
      choices: [
        'View Employee',
        'View Role',
        'View Department',
        'View Employees by Manager',
        'Add Employee',
        'Add Role',
        'Add Department',
        'Update Employee Role',
        'Update Employee Manager',
        'Delete Employee',
        'Delete Role',
        'Delete Department'
      ]
    }
  )
  .then(answer => {
    if (answer === 'View Employee') {
      viewEmployees();
    } else if (answer === 'View Role') {
      viewRoles();
    } else if (answer === 'View Department') {
      viewDepartments();
    } else if (answer === 'View Employees by Manager') {
      viewEmployeesByManager();
    } else if (answer === 'Add Employee') {
      addEmployee();
    } else if (answer === 'Add Role') {
      addRole();
    } else if (answer === 'Add Department') {
      addDepartment();
    } else if (answer === 'Update Employee Role') {
      updateEmployeeRole();
    } else if (answer === 'Update Employee Manager') {
      updateEmployeeManager();
    }
  })
};

interfaceStart();