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

const addRole = () => {
    var departmentIdArray;

    db.query('SELECT id, title FROM employee_role', (err, res) => {
        if (err) {
            console.log(err);
        }
        departmentIdArray = res;
    })

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
            message: 'Please enter the salary of the new role:',
            validate: salaryInput => {
                if (Number.isInteger(salaryInput) === true) {
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
            message: "Select this employee's role:",
            choices: departmentIdArray
        }
    ])
    .then(answers => {
        let departmentIdArrayId = answers.departmentId
        db.query(`INSERT INTO employee_role (title, salary, department_id) VALUES ('${answers.title}', ${answers.salary}, ${departmentIdArrayId.id})`, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.table(res);
        });
    });
};

module.exports = { addRole };