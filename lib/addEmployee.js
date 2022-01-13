const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

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

const addEmployee = () => {
    var roleIdArray;
    var managerIdArray;

    db.query('SELECT id, title FROM employee_role', (err, res) => {
        if (err) {
            console.log(err);
        }
        roleIdArray = res;
    })

    db.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) {
            console.log(err);
        }
        managerIdArray = res;
    })

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
        let roleIdArrayId = answers.roleId
        let managerIdArrayId = answers.managerId
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}', '${answers.lastName}', ${roleIdArrayId.id}, ${managerIdArrayId.id})`, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.table(res);
        });
    });
};

const updateEmployeeRole = () => {
    var roleArray;
    var employeeArray;

    db.query('SELECT id, title FROM employee_role', (err, res) => {
        if (err) {
            console.log(err);
        }
        roleArray = res;
    })

    db.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) {
            console.log(err);
        }
        employeeArray = res;
    })

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
        let employeeArrayId = answers.employeeId
        let roleArrayId = answers.roleId
        db.query(`UPDATE employee SET role_id = ${roleArrayId.id} WHERE id = ${employeeArrayId.id}`, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.table(res);
        });
    });
};

const updateEmployeeManager = () => {
    var employeeArray;
    var managerArray;

    db.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) {
            console.log(err);
        }
        employeeArray = res;
        managerArray = employeeArray.concat('null');
    })

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
        let employeeArrayId = answers.employeeId
        let managerArrayId = answers.managerId
        db.query(`UPDATE employee SET manager_id = ${managerArrayId.id} WHERE id = ${employeeArrayId.id}`, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.table(res);
        });
    });
};

module.exports = { addEmployee, updateEmployeeRole, updateEmployeeManager };