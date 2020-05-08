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
            choices: ['Add Employee', 'View all Employees', 'View all Employees by Department', 'View all Employees by Manager', 'Remove Employee', 'Update Employee', 'Update Employee Manager', 'Add Department', 'Add Role']
        }
    ]).then(answer => {
        if (answer.choice === 'Add Employee') {
            addEmployee();
        } else if (answer.choice === 'View all Employees') {
            viewEmployees();    
        }else if (answer.choice === 'Add Department') {
            addDepartment();    
        }else if (answer.choice === 'Add Role') {
            addRole();    
        }else if (answer.choice === 'Remove Employee') {
            removeEmployee();   
        }else if (answer.choice === 'View all Employees') {
            viewEmployees(); 
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
async function addEmployee() {
    let employees;
    connection.query("SELECT * FROM employee", function(err, results) {
        employees = results;
    })
    
    const employeess = await connection.query("SELECT * FROM employee");
    //console.table(employeess);
    
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
            choices:  employees.map(employeeDetails => ({value: employeeDetails.id, name: employeeDetails.first_name })),
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

function removeEmployee() {
    connection.query("SELECT * FROM employee", function(err, results) {
        inquirer.prompt ([
            {
                type: "rawlist",
                name: "id",
                message: "Which employee do you want to remove?", 
                choices: results.map(employeeDetails => ({value: employeeDetails.id, name: employeeDetails.first_name + " " + employeeDetails.last_name})),
            }
        ]).then(response => {
            connection.query(`DELETE FROM employee where id = ('${response.id}')`, function(err, results) {
                    start();
            });
        })
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function(err, results) {
        console.table(results);
        start();
    })
}



