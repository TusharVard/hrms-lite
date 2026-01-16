const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceByEmployee
} = require('../controllers/attendance.controller');

// POST /api/attendance - Mark attendance
router.post('/', markAttendance);

// GET /api/attendance/employee/:employeeId - Get attendance by employee
router.get('/employee/:employeeId', getAttendanceByEmployee);

module.exports = router;
