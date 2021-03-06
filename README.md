# Employee Tracker
A Content Management System using Node, Inquirer, and MySQL, that allows non-developers to view and interact with information stored in a database.

## Description 
![Last Commit](https://img.shields.io/github/last-commit/cazb67/employee-tracker) ![Top Language](https://img.shields.io/github/languages/top/cazb67/employee-tracker)

A Content Management System that would allow non-developers to view and interact with information stored in a database was created. Using node, inquirer and MySql a solution for managing a company's employees was built. The user is able to do the following; add an employee, add a department, 'add a role', view all employees, view employees by manager, view all departments, view all roles, remove an employee, remove a department, remove a role', 'update an employee role, update an employee's manager' and view total utilised budget of a department.


## Table of Contents
1. [Installation](#Installation)
2. [Usage](#Usage)
3. [Technologies](#Technologies)
4. [Credits](#Credits)
5. [Contributing](#Contributing)
6. [Licence](#License)

## Installation
1. Create a database and seed.sql file to pre-populate database.
2. Connect to the database from node.
3. Create an inquirer function that provides a list of options of tasks that can be carried out.
4. Create separate functions to carry out each of the tasks listed.
5. Test functionality and clean up code throughout.

## Usage
The URL of the git hub repository is https://github.com/CazB67/employee-tracker

To run the interface from the terminal type 

`node employeeTracker.js`

Make sure you add a department first, a role second and then add your employees. You can not add employees if you do not have roles and departments to put them into.

The following GIF shows the application's functionality and how to use. 

<img src="employee-tracker.gif" width="450" height="300" title="Employee Tracker Interface">

## Technologies
NPM, Node js, Inquirer, mySQL

## Credits
- Team at UWA Coding Bootcamp
- How to map an array to object's key value - https://stackoverflow.com/questions/40348171/es6-map-an-array-of-objects-to-return-an-array-of-objects-with-new-keys

## Contributing
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)