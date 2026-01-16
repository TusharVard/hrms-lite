# Postman Testing Guide for HRMS Lite API

## Prerequisites

1. **Start the server:**
   ```bash
   cd backend
   node src/app.js
   ```
   Or with nodemon:
   ```bash
   nodemon src/app.js
   ```

2. **Server should be running on:** `http://localhost:3000`

3. **Make sure your database is set up:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

---

## Test Cases

### 1. Health Check (Optional - Verify Server is Running)

**Request:**
- **Method:** GET
- **URL:** `http://localhost:3000/health`
- **Headers:** None
- **Body:** None

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. ✅ Add Employee

**Request:**
- **Method:** POST
- **URL:** `http://localhost:3000/api/employees`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "department": "Engineering",
    "position": "Software Engineer",
    "hireDate": "2024-01-01",
    "status": "ACTIVE"
  }
  ```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": "uuid-here",
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    ...
  }
}
```

**Save the `id` from the response - you'll need it for attendance tests!**

---

### 3. ✅ Duplicate Employee → Error

**Request:**
- **Method:** POST
- **URL:** `http://localhost:3000/api/employees`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):** (Same as Test 2 - using same employeeId or email)
  ```json
  {
    "employeeId": "EMP001",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "department": "Marketing",
    "position": "Manager"
  }
  ```

**Expected Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Employee with ID EMP001 already exists"
}
```

**OR if using same email:**
```json
{
  "success": false,
  "message": "Employee with email john.doe@example.com already exists"
}
```

---

### 4. ✅ Mark Attendance

**Request:**
- **Method:** POST
- **URL:** `http://localhost:3000/api/attendance`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "employeeId": "PASTE_EMPLOYEE_ID_FROM_TEST_2",
    "date": "2024-01-15",
    "checkIn": "2024-01-15T09:00:00Z",
    "checkOut": "2024-01-15T18:00:00Z",
    "breakStart": "2024-01-15T13:00:00Z",
    "breakEnd": "2024-01-15T14:00:00Z",
    "status": "PRESENT",
    "notes": "Regular working day"
  }
  ```

**Note:** Replace `PASTE_EMPLOYEE_ID_FROM_TEST_2` with the actual employee `id` from Test 2 response.

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "id": "uuid-here",
    "employeeId": "employee-uuid",
    "date": "2024-01-15T00:00:00.000Z",
    "checkIn": "2024-01-15T09:00:00.000Z",
    "checkOut": "2024-01-15T18:00:00.000Z",
    ...
  }
}
```

**Alternative - Simple Check-in (without all fields):**
```json
{
  "employeeId": "PASTE_EMPLOYEE_ID_FROM_TEST_2",
  "checkIn": "2024-01-15T09:00:00Z"
}
```

---

### 5. ✅ Duplicate Attendance Same Date → Error

**Request:**
- **Method:** POST
- **URL:** `http://localhost:3000/api/attendance`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):** (Same employeeId and date as Test 4)
  ```json
  {
    "employeeId": "PASTE_EMPLOYEE_ID_FROM_TEST_2",
    "date": "2024-01-15",
    "checkIn": "2024-01-15T08:30:00Z"
  }
  ```

**Expected Response (200 OK - Updates existing):**
```json
{
  "success": true,
  "message": "Attendance updated successfully",
  "data": {
    ...
  }
}
```

**Note:** The system updates the existing record instead of creating a duplicate. This is by design - one attendance record per employee per day.

**To test actual error, try creating with different date first, then same date:**
1. Create attendance for "2024-01-16" - should succeed
2. Try to create another for "2024-01-16" - will update existing (not error, but shows uniqueness constraint works)

---

### 6. ✅ Fetch Attendance by Employee

**Request:**
- **Method:** GET
- **URL:** `http://localhost:3000/api/attendance/employee/PASTE_EMPLOYEE_ID_FROM_TEST_2`
- **Headers:** None
- **Body:** None

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": "uuid-here",
      "employeeId": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      ...
    },
    "attendances": [
      {
        "id": "uuid-here",
        "date": "2024-01-15T00:00:00.000Z",
        "checkIn": "2024-01-15T09:00:00.000Z",
        "checkOut": "2024-01-15T18:00:00.000Z",
        "workingHours": 8.0,
        "breakDuration": 1.0,
        "status": "PRESENT",
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 30,
      "total": 1,
      "totalPages": 1,
      ...
    }
  }
}
```

**With Query Parameters (Optional):**
- **URL:** `http://localhost:3000/api/attendance/employee/PASTE_EMPLOYEE_ID_FROM_TEST_2?startDate=2024-01-01&endDate=2024-01-31&status=PRESENT&page=1&limit=10`

---

## Quick Test Checklist

- [ ] ✅ Health check works
- [ ] ✅ Add employee - Success (201)
- [ ] ✅ Duplicate employee (same employeeId) - Error (409)
- [ ] ✅ Duplicate employee (same email) - Error (409)
- [ ] ✅ Mark attendance - Success (201)
- [ ] ✅ Mark attendance same date - Updates existing (200)
- [ ] ✅ Fetch attendance by employee - Success (200)
- [ ] ✅ Fetch attendance with filters - Success (200)

---

## Common Issues & Solutions

### Issue: "Employee not found" when marking attendance
**Solution:** Make sure you're using the employee `id` (UUID), not `employeeId` (EMP001)

### Issue: "Cannot mark attendance for employee with status: INACTIVE"
**Solution:** Employee must have status "ACTIVE" to mark attendance

### Issue: Port already in use
**Solution:** Change PORT in `.env` or kill the process using port 3000

### Issue: Database connection error
**Solution:** 
1. Check `DATABASE_URL` in `.env`
2. Run `npx prisma migrate dev`
3. Run `npx prisma generate`

---

## Postman Collection Setup Tips

1. **Create Environment Variables:**
   - `base_url`: `http://localhost:3000`
   - `employee_id`: (will be set from Test 2 response)

2. **Use Tests Tab to Auto-save employee_id:**
   ```javascript
   if (pm.response.code === 201) {
       const jsonData = pm.response.json();
       pm.environment.set("employee_id", jsonData.data.id);
   }
   ```

3. **Use Variables in URLs:**
   - `{{base_url}}/api/employees`
   - `{{base_url}}/api/attendance/employee/{{employee_id}}`

---

## Sample Test Data

### Employee 1:
```json
{
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "position": "Software Engineer"
}
```

### Employee 2:
```json
{
  "employeeId": "EMP002",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "department": "Marketing",
  "position": "Manager"
}
```

---

Happy Testing! 🚀
