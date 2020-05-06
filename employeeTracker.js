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
            choices: ['Add Employee', 'View all Employees', 'View all Employees by Department', 'View all Employees by Manager', 'Remove Employee', 'Update Employee', 'Update Employee Manager']
        }
    ]).then(answer => {
        if (answer.choice === 'Add Employee') {
            addEmployee ();
        } else if (answer.choice === 'View all Employees') {
            viewEmployees ();    
        }
    })
}

function addEmployee() {
    con.query('SELECT * FROM employee', function (error, results, fields){
        console.log(results);
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
            type: "input",
            name: "role",
            message: "What's the employee's role?"
        },
        {
            type: "input",
            name: "manager",
            message: "Who is the employee's manager?"
        },
    ]).then(response => {
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.firstName}", "${response.lastname}", "${response.role}", "${response.manager}")`, 
        function (err, res){
            console.log(err);
            console.log(res);
        });
    })
}


