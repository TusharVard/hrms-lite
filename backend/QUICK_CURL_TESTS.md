# Quick curl Commands for Deployed Backend

## Base URL
```
https://hrms-lite-yo3x.onrender.com
```

## Quick Tests

### 1. Health Check
```bash
curl https://hrms-lite-yo3x.onrender.com/health
```

### 2. List Employees
```bash
curl https://hrms-lite-yo3x.onrender.com/api/employees
```

### 3. Add Employee
```bash
curl -X POST https://hrms-lite-yo3x.onrender.com/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "department": "Engineering"
  }'
```

### 4. Update Employee (Replace ID)
```bash
curl -X PUT https://hrms-lite-yo3x.onrender.com/api/employees/PASTE_EMPLOYEE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "department": "Marketing"
  }'
```

### 5. Delete Employee (Replace ID)
```bash
curl -X DELETE https://hrms-lite-yo3x.onrender.com/api/employees/PASTE_EMPLOYEE_ID_HERE
```

### 6. Mark Attendance (Replace Employee ID)
```bash
curl -X POST https://hrms-lite-yo3x.onrender.com/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "PASTE_EMPLOYEE_ID_HERE",
    "date": "2024-01-16",
    "checkIn": "2024-01-16T09:00:00Z",
    "status": "PRESENT"
  }'
```

### 7. Get Attendance (Replace Employee ID)
```bash
curl https://hrms-lite-yo3x.onrender.com/api/attendance/employee/PASTE_EMPLOYEE_ID_HERE
```

---

## Pretty Print (with jq)

Add `| jq` to any command:
```bash
curl https://hrms-lite-yo3x.onrender.com/api/employees | jq
```

---

## Complete Test Flow

```bash
# 1. Health check
curl https://hrms-lite-yo3x.onrender.com/health

# 2. Add employee (save the id from response)
curl -X POST https://hrms-lite-yo3x.onrender.com/api/employees \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"EMP001","firstName":"John","lastName":"Doe","email":"john@example.com"}'

# 3. Update employee (use id from step 2)
curl -X PUT https://hrms-lite-yo3x.onrender.com/api/employees/PASTE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"department":"Updated Department"}'

# 4. Mark attendance
curl -X POST https://hrms-lite-yo3x.onrender.com/api/attendance \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"PASTE_ID_HERE","checkIn":"2024-01-16T09:00:00Z"}'

# 5. Get attendance
curl https://hrms-lite-yo3x.onrender.com/api/attendance/employee/PASTE_ID_HERE
```
