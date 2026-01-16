import './EmployeeTable.css';

function EmployeeTable({ employees, onEdit, onDelete }) {
  const getStatusBadge = (status) => {
    const statusClasses = {
      ACTIVE: 'badge-success',
      INACTIVE: 'badge-warning',
      TERMINATED: 'badge-danger',
      ON_LEAVE: 'badge-info',
    };
    return statusClasses[status] || 'badge-default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (employees.length === 0) {
    return null;
  }

  return (
    <div className="employee-table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Status</th>
            <th>Hire Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="employee-id">{employee.employeeId}</td>
              <td className="employee-name">
                {employee.firstName} {employee.lastName}
              </td>
              <td className="employee-email">{employee.email}</td>
              <td>{employee.department || '—'}</td>
              <td>{employee.position || '—'}</td>
              <td>
                <span className={`badge ${getStatusBadge(employee.status)}`}>
                  {employee.status}
                </span>
              </td>
              <td>{formatDate(employee.hireDate)}</td>
              <td className="actions">
                <button
                  className="btn-icon btn-edit"
                  onClick={() => onEdit(employee)}
                  title="Edit employee"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => onDelete(employee.id)}
                  title="Delete employee"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
