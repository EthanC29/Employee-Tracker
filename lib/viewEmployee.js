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

const viewEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, employee_role.title,
                employee_role.salary, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
              FROM employee
              LEFT JOIN employee manager ON employee.manager_id = manager.id
              INNER JOIN employee_role ON employee.role_id = employee_role.id`, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
    })
}

const viewEmployeesByManager = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, employee_role.title,
                employee_role.salary, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
              FROM employee
              ORDER BY manager
              LEFT JOIN employee manager ON employee.manager_id = manager.id
              INNER JOIN employee_role ON employee.role_id = employee_role.id`, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
    })
}

module.exports = { viewEmployees, viewEmployeesByManager };