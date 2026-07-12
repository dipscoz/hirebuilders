const router = require("express").Router();

const {
  getEmployees,
  addEmployee
} = require("../controllers/employeeController");

router.get("/", getEmployees);
router.post("/", addEmployee);

module.exports = router;
router.delete("/:id", async (req, res) => {

  const Employee = require("../models/Employee");

  await Employee.findByIdAndDelete(req.params.id);

  res.json({ message: "supprimé" });

});