const express = require('express');
const router = express.Router();
const {
  addEmployee,
  listEmployees,
  deleteEmployee
} = require('../controllers/employee.controller');

// POST /api/employees - Add a new employee
router.post('/', addEmployee);

// GET /api/employees - List all employees
router.get('/', listEmployees);

// DELETE /api/employees/:id - Delete an employee
router.delete('/:id', deleteEmployee);

module.exports = router;
