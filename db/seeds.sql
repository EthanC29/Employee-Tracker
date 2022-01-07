INSERT INTO department (department_name)
VALUES ("Administration & Operations"),
       ("Research & Design"),
       ("Marketing & Sales"),
       ("Human Resources"),
       ("Customer Service"),
       ("Accounting & Finance");


INSERT INTO employee_role (title, salary, department_id)
VALUES ("President", 300000, 1),
       ("Director", 180000, 2),
       ("Manager", 100000, 3),
       ("Employee", 80000, 6),
       ("Assistant", 50000, 4),
       ("Intern", 45000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Peter", "Dinklage", 1, null),
       ("Harry", "Potter", 2, 1),
       ("Sonic", "Hedgehog", 3, 2),
       ("Colonel", "Sanders", 4, 3),
       ("Gillian", "Anderson", 5, 3),
       ("Seth", "Rogen", 6, 4);