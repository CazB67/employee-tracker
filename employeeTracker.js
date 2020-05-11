const mysql = require("mysql");
const inquirer = require("inquirer");

//Create connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'OscarChloeLeo1',
    database: 'employee_tracker_db'
})

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

function start() {
    inquirer.prompt ([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ['Add Employee', 'Add Department', 'Add Role', 'View all Employees', 'View all Departments', 'View all Roles', 'Remove Employee', 'Remove Department', 'Remove Role', 'Update Employee Role', 'Update Employee Manager', 'View total utilised budget of a department', 'Exit'  ]
        }
    ]).then(answer => {
        if (answer.choice === 'Add Employee') {
            addEmployee();
        }else if (answer.choice === 'Add Department') {
            addDepartment();    
        }else if (answer.choice === 'Add Role') {
            addRole();    
        }else if (answer.choice === 'View all Employees') {
            viewEmployees(); 
        }else if (answer.choice === 'View all Departments') {
            viewDepartments();   
        }else if (answer.choice === 'View all Roles') {
            viewRoles();   
        }else if (answer.choice === 'Remove Employee') {
            removeEmployee();   
        }else if (answer.choice === 'Remove Department') {
            removeDepartment();   
        }else if (answer.choice === 'Remove Role') {
            removeRole();   
        }else if (answer.choice === 'Update Employee Role') {
            updateEmployeeRole();   
        }else if (answer.choice === 'Update Employee Manager') {
            updateEmployeeManager();   
        }else if (answer.choice === 'View total utilised budget of a department') {
            viewDepartmentBudget();   
        }else{
            connection.end();
        }
    })
}

function addDepartment() {
    inquirer.prompt ([
        {
            type: "input",
            name: "departmentName",
            message: "Add a Department" 
        }
    ]).then(response => {
        connection.query(`INSERT INTO department (name) VALUES ("${response.departmentName}")`, 
            function (err, res){
                start();
            });
    }) 
}

function addRole(){
    connection.query("SELECT * FROM department", function(err, results) {
        inquirer.prompt ([
            {
                type: "input",
                name: "title",
                message: "Add a role"    
            },
            {
                type: "input",
                name: "salary",
                message: "Add salary"    
            },
            {
                type: "rawlist",
                name: "departmentId",
                message: "Add department",
                choices: results.map(departmentDetails => ({value: departmentDetails.id, name: departmentDetails.name}))
            }
        ]).then(response => {
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${response.title}", "${response.salary}", "${response.departmentId}")`, 
                function (err, res){
                    start();
                });
        })
     })
}

function addEmployee() {
    let employees;
    connection.query("SELECT * FROM employee", function(err, results) {
        employees = results;
    })
    connection.query('SELECT * FROM role', function (error, results, fields){
    inquirer.prompt ([
        {
            type: "input",
            name: "firstName",
            message: "What's the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What's the employee's last name?"
        },
        {
            type: "rawlist",
            name: "role",
            message: "What's the employee's role?",
            choices: results.map(roleDetails => ({value: roleDetails.id, name: roleDetails.title }))
        },
        {
            type: "rawlist",
            name: "queryManager",
            message: "Do this employee have a manager?",
            choices: ['Yes', 'No']
        },
        {
            type: "rawlist",
            name: "manager",
            message: "Who is the employee's manager?",
            choices:  employees.map(employeeDetails => ({value: employeeDetails.id, name: employeeDetails.first_name + " " + employeeDetails.last_name })),
            when: function(response){
                    return(response.queryManager === 'Yes')
                  }
        }
    ]).then(response => {
        if(response.queryManager === "No"){
            connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${response.firstName}", "${response.lastName}", "${response.role}")`, 
            function (err, res){
                start();
            });
        }else{
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.firstName}", "${response.lastName}", "${response.role}", "${response.manager}")`, 
            function (err, res){
                start();
            });
        }
        }) 
    })
}

function viewEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title as role_title, role.salary, department.name as department_name, employee.manager_id,  concat(B.first_name, \" \", B.last_name) as manager_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee B on employee.manager_id = B.id", function(err, results) {
        console.table(results);
        start();
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function(err, results) {
        console.table(results);
        start();
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function(err, results) {
        console.table(results);
        start();
    })
}

function updateEmployeeRole() {
    let updateRole;
    connection.query("SELECT * FROM role", function(err, results) {
        updateRole = results;
    connection.query("SELECT * FROM employee", function(err, results) {
        inquirer.prompt ([
            {
                type: "rawlist",
                name: "selectEmployee",
                message: "Which employee do you want to update?", 
                choices: results.map(employeeDetails => ({value: employeeDetails.id, name: employeeDetails.first_name + " " + employeeDetails.last_name})),
            },
            {
                type: "rawlist",
                name: "newRole",
                message: "What is their new role?", 
                choices: updateRole.map(roleDetails => ({value: roleDetails.id, name: roleDetails.title }))
            }
        ]).then(response => {
            connection.query(`UPDATE employee SET employee.role_id = ('${response.newRole}') where employee.id = ('${response.selectEmployee}')`, function(err, results) {
                    start();
            });
            })
        })
    })
}

function updateEmployeeManager() {
    connection.query("SELECT * FROM employee", function(err, results) {
        inquirer.prompt ([
            {
                type: "rawlist",
                name: "selectEmployee",
                message: "Which employee do you want to update?", 
                choices: results.map(employeeDetails => ({value: employeeDetails.id, name: employeeDetails.first_name + " " + employeeDetails.last_name})),
            },
            {
                type: "rawlist",
                name: "newManager",
                message: "Who is their new manager?", 
                choices: results.map(managerDetails => ({value: managerDetails.id, name: managerDetails.first_name + " " + managerDetails.last_name }))
            }
        ]).then(response => {
            connection.query(`UPDATE employee SET employee.manager_id = ('${response.newManager}') where employee.id = ('${response.selectEmployee}')`, function(err, results) {
                    start();
            });
            })
        })
}

function removeEmployee() {
    connection.query("SELECT * FROM employee", function(err, results) {
        inquirer.prompt ([
            {
                type: "rawlist",
                name: "remove",
                message: "Which employee do you want to remove?", 
                choices: results.map(employeeDetails => ({value: employeeDetails.id, name: employeeDetails.first_name + " " + employeeDetails.last_name})),
            }
        ]).then(response => {
            connection.query(`DELETE FROM employee where id = ('${response.remove}')`, function(err, results) {
                    start();
            });
        })
    })
}

function removeDepartment() {
    connection.query("SELECT * FROM department", function(err, results) {
        inquirer.prompt ([
            {
                type: "rawlist",
                name: "remove",
                message: "Which department do you want to remove?", 
                choices: results.map(departmentDetails => ({value: departmentDetails.id, name: departmentDetails.name})),
            }
        ]).then(response => {
            connection.query(`DELETE FROM department where id = ('${response.remove}')`, function(err, results) {
                    start();
            });
        })
    })
}

function removeRole() {
    connection.query("SELECT * FROM role", function(err, results) {
        inquirer.prompt ([
            {
                type: "rawlist",
                name: "remove",
                message: "Which role do you want to remove?", 
                choices: results.map(roleDetails => ({value: roleDetails.id, name: roleDetails.title})),
            }
        ]).then(response => {
            connection.query(`DELETE FROM role where id = ('${response.remove}')`, function(err, results) {
                    start();
            });
        })
    })
}

function viewDepartmentBudget() {
    connection.query("SELECT * FROM department", function(err, results) {
        inquirer.prompt ([
            {
                type: "rawlist",
                name: "utilisedBudget",
                message: "Which department do you want to view?", 
                choices: results.map(departmentDetails => ({value: departmentDetails.id, name: departmentDetails.name})),
            }
        ]).then(response => {
            connection.query(`SELECT SUM(role.salary) as total_utilised_department_budget, department.name as department_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id WHERE department.id = ('${response.utilisedBudget}') GROUP BY department.name`, function(err, results) {
                console.table(results)
                start();
            });
        })
    })
}
        



