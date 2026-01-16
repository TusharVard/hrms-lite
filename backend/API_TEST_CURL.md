# API Testing with cURL

## Base URLs

**Local Development:**
```
http://localhost:3000
```

**Deployed Backend:**
```
https://hrms-lite-yo3x.onrender.com
```

Replace `http://localhost:3000` with `https://hrms-lite-yo3x.onrender.com` for deployed backend testing.

## 1. Health Check

```bash
curl -X GET http://localhost:3000/health
```

## 2. Add Employee

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "department": "Engineering",
    "position": "Software Engineer",
    "hireDate": "2024-01-01",
    "status": "ACTIVE"
  }'
```

**Save the `id` from the response for attendance tests!**

## 3. List Employees

```bash
# Get all employees
curl -X GET http://localhost:3000/api/employees

# With pagination
curl -X GET "http://localhost:3000/api/employees?page=1&limit=10"

# Filter by status
curl -X GET "http://localhost:3000/api/employees?status=ACTIVE"

# Search employees
curl -X GET "http://localhost:3000/api/employees?search=John"
```

## 4. Duplicate Employee (Should Return Error)

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com"
  }'
```

**Expected:** 409 Conflict error

## 5. Mark Attendance

**Replace `EMPLOYEE_ID` with the actual `id` from step 2 response!**

```bash
curl -X POST http://localhost:3000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMPLOYEE_ID",
    "date": "2024-01-15",
    "checkIn": "2024-01-15T09:00:00Z",
    "checkOut": "2024-01-15T18:00:00Z",
    "breakStart": "2024-01-15T13:00:00Z",
    "breakEnd": "2024-01-15T14:00:00Z",
    "status": "PRESENT",
    "notes": "Regular working day"
  }'
```

**Simple check-in only:**

```bash
curl -X POST http://localhost:3000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMPLOYEE_ID",
    "checkIn": "2024-01-16T09:00:00Z"
  }'
```

## 6. Duplicate Attendance Same Date (Updates Existing)

```bash
curl -X POST http://localhost:3000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMPLOYEE_ID",
    "date": "2024-01-15",
    "checkIn": "2024-01-15T08:30:00Z",
    "checkOut": "2024-01-15T17:30:00Z"
  }'
```

**Expected:** 200 OK (updates existing record)

## 7. Fetch Attendance by Employee

**Replace `EMPLOYEE_ID` with the actual `id` from step 2 response!**

```bash
curl -X GET http://localhost:3000/api/attendance/employee/EMPLOYEE_ID
```

**With filters:**

```bash
# Date range
curl -X GET "http://localhost:3000/api/attendance/employee/EMPLOYEE_ID?startDate=2024-01-01&endDate=2024-01-31"

# Filter by status
curl -X GET "http://localhost:3000/api/attendance/employee/EMPLOYEE_ID?status=PRESENT"

# With pagination
curl -X GET "http://localhost:3000/api/attendance/employee/EMPLOYEE_ID?page=1&limit=10"

# Combined filters
curl -X GET "http://localhost:3000/api/attendance/employee/EMPLOYEE_ID?startDate=2024-01-01&endDate=2024-01-31&status=PRESENT&page=1&limit=10"
```

## 8. Update Employee

**Replace `EMPLOYEE_ID` with the actual `id` from step 2 response!**

```bash
curl -X PUT http://localhost:3000/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "department": "Engineering",
    "position": "Senior Software Engineer",
    "status": "ACTIVE"
  }'
```

**Update only specific fields:**
```bash
# Update only email
curl -X PUT http://localhost:3000/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -d '{"email": "newemail@example.com"}'

# Update only department
curl -X PUT http://localhost:3000/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -d '{"department": "Marketing"}'

# Update status
curl -X PUT http://localhost:3000/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "INACTIVE"}'
```

## 9. Delete Employee

**Replace `EMPLOYEE_ID` with the actual `id` from step 2 response!**

```bash
curl -X DELETE http://localhost:3000/api/employees/EMPLOYEE_ID
```

---

## Quick Test Sequence

```bash
# 1. Health check
curl http://localhost:3000/health

# 2. Add employee (save the id from response)
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"EMP001","firstName":"John","lastName":"Doe","email":"john@example.com"}'

# 3. Mark attendance (use id from step 2)
curl -X POST http://localhost:3000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"PASTE_ID_HERE","checkIn":"2024-01-15T09:00:00Z"}'

# 4. Fetch attendance
curl http://localhost:3000/api/attendance/employee/PASTE_ID_HERE
```

---

## Pretty Print JSON Responses

Add `| jq` to any command for formatted output:

```bash
curl http://localhost:3000/health | jq
```

Or use `python -m json.tool`:

```bash
curl http://localhost:3000/health | python -m json.tool
```

---

## Common Issues

1. **"Employee not found"** - Make sure you're using the employee `id` (UUID), not `employeeId` (EMP001)
2. **Connection refused** - Make sure server is running on port 3000
3. **404 Not Found** - Check the endpoint URL and make sure routes are registered
