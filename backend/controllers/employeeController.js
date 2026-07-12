const Employee = require("../models/Employee");

// GET ALL
exports.getEmployees = async (req, res) => {
  const data = await Employee.find();
  res.json(data);
};

// CREATE
exports.addEmployee = async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.json(emp);
};