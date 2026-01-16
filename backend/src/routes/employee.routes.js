const express = require('express');
const router = express.Router();
const {
  addEmployee,
  listEmployees,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employee.controller');

// POST /api/employees - Add a new employee
router.post('/', addEmployee);

// GET /api/employees - List all employees
router.get('/', listEmployees);

// PUT /api/employees/:id - Update an employee
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id - Delete an employee
router.delete('/:id', deleteEmployee);

module.exports = router;
