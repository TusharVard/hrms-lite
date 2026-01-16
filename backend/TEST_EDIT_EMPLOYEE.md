# Test Edit Employee API with curl

## Base URL
```
https://hrms-lite-yo3x.onrender.com/api
```

## Test Edit Employee Endpoint

### 1. First, Get an Employee ID

**List all employees:**
```bash
curl https://hrms-lite-yo3x.onrender.com/api/employees
```

**Get employee by ID (replace `EMPLOYEE_ID` with actual ID):**
```bash
curl https://hrms-lite-yo3x.onrender.com/api/employees
```

### 2. Update Employee

**Update employee (replace `EMPLOYEE_ID` with actual employee ID from step 1):**
```bash
curl -X PUT https://hrms-lite-yo3x.onrender.com/api/employees/EMPLOYEE_ID \
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

### 3. Update Only Specific Fields

**Update only email:**
```bash
curl -X PUT https://hrms-lite-yo3x.onrender.com/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com"
  }'
```

**Update only department:**
```bash
curl -X PUT https://hrms-lite-yo3x.onrender.com/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "department": "Marketing"
  }'
```

**Update status:**
```bash
curl -X PUT https://hrms-lite-yo3x.onrender.com/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "INACTIVE"
  }'
```

### 4. Test Error Cases

**Update non-existent employee:**
```bash
curl -X PUT https://hrms-lite-yo3x.onrender.com/api/employees/invalid-id \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test"
  }'
```

**Update with duplicate email:**
```bash
curl -X PUT https://hrms-lite-yo3x.onrender.com/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing-email@example.com"
  }'
```

**Update with invalid status:**
```bash
curl -X PUT https://hrms-lite-yo3x.onrender.com/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "INVALID_STATUS"
  }'
```

---

## Complete Test Flow

```bash
# 1. List employees to get an ID
curl https://hrms-lite-yo3x.onrender.com/api/employees

# 2. Copy an employee ID from the response, then update
curl -X PUT https://hrms-lite-yo3x.onrender.com/api/employees/PASTE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "email": "updated@example.com",
    "department": "Updated Department"
  }'

# 3. Verify update by listing again
curl https://hrms-lite-yo3x.onrender.com/api/employees
```

---

## Expected Responses

### Success (200 OK):
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": "...",
    "employeeId": "EMP001",
    "firstName": "Updated",
    "lastName": "Name",
    "email": "updated@example.com",
    ...
  }
}
```

### Error - Not Found (404):
```json
{
  "success": false,
  "message": "Employee not found"
}
```

### Error - Duplicate Email (409):
```json
{
  "success": false,
  "message": "Employee with email ... already exists"
}
```
