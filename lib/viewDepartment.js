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

const viewDepartments = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
    })
}

module.exports = { viewDepartments };