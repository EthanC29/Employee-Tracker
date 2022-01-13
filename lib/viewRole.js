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

const viewRoles = () => {
    db.query(`SELECT employee_role.*,
                department.department_name AS department_name
              FROM employee_role
              LEFT JOIN department ON employee_role.department_id = department.id`, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
    })
}

module.exports = { viewRoles };