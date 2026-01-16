const prisma = require('../prisma/prismaClient');

/**
 * Add a new employee
 * POST /api/employees
 */
const addEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      hireDate,
      status
    } = req.body;

    // Validation
    if (!employeeId || !firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: employeeId, firstName, lastName, and email are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate status if provided
    const validStatuses = ['ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate hireDate format if provided
    if (hireDate) {
      const date = new Date(hireDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid hireDate format. Use ISO 8601 format (YYYY-MM-DD)'
        });
      }
    }

    // Check if employeeId already exists
    const existingEmployeeId = await prisma.employee.findUnique({
      where: { employeeId }
    });

    if (existingEmployeeId) {
      return res.status(409).json({
        success: false,
        message: `Employee with ID ${employeeId} already exists`
      });
    }

    // Check if email already exists
    const existingEmail = await prisma.employee.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: `Employee with email ${email} already exists`
      });
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        employeeId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        department: department?.trim() || null,
        position: position?.trim() || null,
        hireDate: hireDate ? new Date(hireDate) : null,
        status: status || 'ACTIVE'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * List all employees with optional filtering and pagination
 * GET /api/employees
 */
const listEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      department,
      search
    } = req.query;

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
      const validStatuses = ['ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // Build where clause
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (department) {
      where.department = {
        contains: department,
        mode: 'insensitive'
      };
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;

    // Get total count and employees
    const [total, employees] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          department: true,
          position: true,
          hireDate: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error listing employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Delete an employee by ID
 * DELETE /api/employees/:id
 */
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Delete employee (attendance records will be cascade deleted)
    await prisma.employee.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: {
        id: employee.id,
        employeeId: employee.employeeId,
        name: `${employee.firstName} ${employee.lastName}`
      }
    });
  } catch (error) {
    console.error('Error deleting employee:', error);

    // Handle Prisma record not found error
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  addEmployee,
  listEmployees,
  deleteEmployee
};
