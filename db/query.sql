SELECT
  employee.last_name AS last_name, employee.first_name AS first_name, eployee_role.title AS title, eployee_role.salary AS salary, department.department_name AS department, employee.last_name AS superior
FROM employee
JOIN employee_role ON employee.role_id = employee_role.id,

FROM employee
JOIN employee ON employee.manager_id = employee.id,

FROM employee_role
JOIN department ON employee_role.department_id = department.id;