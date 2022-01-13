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
        db.query(`INSERT INTO department (department_name) VALUES ('${answer.name}')`, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.table(res);
        });
    });
};

module.exports = { addDepartment };