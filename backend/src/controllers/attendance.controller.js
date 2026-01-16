const prisma = require('../prisma/prismaClient');

/**
 * Mark attendance (check-in, check-out, breaks)
 * POST /api/attendance
 */
const markAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      date,
      checkIn,
      checkOut,
      breakStart,
      breakEnd,
      status,
      notes
    } = req.body;

    // Validation - employeeId is required
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if employee is active
    if (employee.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: `Cannot mark attendance for employee with status: ${employee.status}`
      });
    }

    // Use provided date or today's date
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0); // Set to start of day

    // Validate date format
    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)'
      });
    }

    // Validate status if provided
    const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate datetime fields
    const validateDateTime = (fieldName, value) => {
      if (!value) return null;
      const dateTime = new Date(value);
      if (isNaN(dateTime.getTime())) {
        throw new Error(`Invalid ${fieldName} format. Use ISO 8601 format`);
      }
      return dateTime;
    };

    let checkInTime, checkOutTime, breakStartTime, breakEndTime;

    try {
      checkInTime = validateDateTime('checkIn', checkIn);
      checkOutTime = validateDateTime('checkOut', checkOut);
      breakStartTime = validateDateTime('breakStart', breakStart);
      breakEndTime = validateDateTime('breakEnd', breakEnd);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Validate check-out is after check-in
    if (checkInTime && checkOutTime && checkOutTime <= checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'Check-out time must be after check-in time'
      });
    }

    // Validate break times
    if (breakStartTime && checkInTime && breakStartTime < checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'Break start time must be after check-in time'
      });
    }

    if (breakEndTime && breakStartTime && breakEndTime <= breakStartTime) {
      return res.status(400).json({
        success: false,
        message: 'Break end time must be after break start time'
      });
    }

    if (breakEndTime && checkOutTime && breakEndTime > checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'Break end time must be before check-out time'
      });
    }

    // Check if attendance record already exists for this date
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: attendanceDate
        }
      }
    });

    let attendance;

    if (existingAttendance) {
      // Update existing attendance record
      const updateData = {};
      
      // Only update fields that are provided
      if (checkInTime !== null) updateData.checkIn = checkInTime;
      if (checkOutTime !== null) updateData.checkOut = checkOutTime;
      if (breakStartTime !== null) updateData.breakStart = breakStartTime;
      if (breakEndTime !== null) updateData.breakEnd = breakEndTime;
      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes?.trim() || null;

      attendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: updateData,
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
    } else {
      // Create new attendance record
      // Auto-determine status if not provided
      let attendanceStatus = status || 'PRESENT';
      
      // If check-in is provided and it's late (after 9:30 AM), mark as LATE
      if (checkInTime && !status) {
        const lateThreshold = new Date(checkInTime);
        lateThreshold.setHours(9, 30, 0, 0);
        if (checkInTime > lateThreshold) {
          attendanceStatus = 'LATE';
        }
      }

      attendance = await prisma.attendance.create({
        data: {
          employeeId,
          date: attendanceDate,
          checkIn: checkInTime,
          checkOut: checkOutTime,
          breakStart: breakStartTime,
          breakEnd: breakEndTime,
          status: attendanceStatus,
          notes: notes?.trim() || null
        },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
    }

    res.status(existingAttendance ? 200 : 201).json({
      success: true,
      message: existingAttendance 
        ? 'Attendance updated successfully' 
        : 'Attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Error marking attendance:', error);

    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Attendance record already exists for this employee and date'
      });
    }

    // Handle Prisma foreign key constraint errors
    if (error.code === 'P2003') {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get attendance records by employee ID
 * GET /api/attendance/employee/:employeeId
 */
const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      startDate,
      endDate,
      status,
      page = 1,
      limit = 30
    } = req.query;

    // Validate employeeId
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        email: true,
        department: true,
        position: true
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Validate pagination parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page and limit must be positive integers'
      });
    }

    if (limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit cannot exceed 100'
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // Validate date range
    let start, end;
    if (startDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (isNaN(start.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid startDate format. Use ISO 8601 format (YYYY-MM-DD)'
        });
      }
    }

    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid endDate format. Use ISO 8601 format (YYYY-MM-DD)'
        });
      }
    }

    // Validate date range logic
    if (start && end && start > end) {
      return res.status(400).json({
        success: false,
        message: 'startDate must be before or equal to endDate'
      });
    }

    // Build where clause
    const where = {
      employeeId
    };

    if (status) {
      where.status = status;
    }

    if (start || end) {
      where.date = {};
      if (start) where.date.gte = start;
      if (end) where.date.lte = end;
    }

    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;

    // Get total count and attendance records
    const [total, attendances] = await Promise.all([
      prisma.attendance.count({ where }),
      prisma.attendance.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          date: 'desc'
        },
        select: {
          id: true,
          date: true,
          checkIn: true,
          checkOut: true,
          breakStart: true,
          breakEnd: true,
          status: true,
          notes: true,
          createdAt: true,
          updatedAt: true
        }
      })
    ]);

    // Calculate working hours for each attendance record
    const attendancesWithHours = attendances.map(attendance => {
      let workingHours = null;
      let breakDuration = null;

      if (attendance.checkIn && attendance.checkOut) {
        const totalMs = attendance.checkOut.getTime() - attendance.checkIn.getTime();
        workingHours = totalMs / (1000 * 60 * 60); // Convert to hours

        if (attendance.breakStart && attendance.breakEnd) {
          const breakMs = attendance.breakEnd.getTime() - attendance.breakStart.getTime();
          breakDuration = breakMs / (1000 * 60 * 60); // Convert to hours
          workingHours -= breakDuration;
        }
      }

      return {
        ...attendance,
        workingHours: workingHours ? parseFloat(workingHours.toFixed(2)) : null,
        breakDuration: breakDuration ? parseFloat(breakDuration.toFixed(2)) : null
      };
    });

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: {
        employee,
        attendances: attendancesWithHours,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPreviousPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  markAttendance,
  getAttendanceByEmployee
};
