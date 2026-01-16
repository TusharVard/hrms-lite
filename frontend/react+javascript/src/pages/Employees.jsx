import { useState, useEffect } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import apiClient from '../config/axios';
import './Employees.css';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch employees
  const fetchEmployees = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/employees', {
        params: { page, limit },
      });
      
      if (response.data.success) {
        setEmployees(response.data.data || []);
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch employees');
      }
    } catch (err) {
      setError(err.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle employee added/updated
  const handleEmployeeSaved = () => {
    setShowForm(false);
    setEditingEmployee(null);
    setFormMode('add');
    fetchEmployees(pagination.page, pagination.limit);
  };

  // Handle edit employee
  // Note: Edit functionality requires backend update endpoint
  const handleEdit = (employee) => {
    alert('Edit functionality requires an update endpoint. For now, please delete and recreate the employee.');
    // Uncomment when update endpoint is available:
    // setEditingEmployee(employee);
    // setFormMode('edit');
    // setShowForm(true);
  };

  // Handle delete employee
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await apiClient.delete(`/employees/${id}`);
      // Refresh the list
      fetchEmployees(pagination.page, pagination.limit);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchEmployees(newPage, pagination.limit);
  };

  return (
    <div className="employees-page">
      <div className="employees-header">
        <div>
          <h1>Employee Management</h1>
          <p className="subtitle">Manage your organization's employees</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setFormMode('add');
            setEditingEmployee(null);
          }}
          disabled={loading}
        >
          + Add Employee
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => fetchEmployees()}>Retry</button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{formMode === 'add' ? 'Add New Employee' : 'Edit Employee'}</h2>
              <button
                className="btn-close"
                onClick={() => {
                  setShowForm(false);
                  setEditingEmployee(null);
                  setFormMode('add');
                }}
              >
                ×
              </button>
            </div>
            <EmployeeForm
              employee={editingEmployee}
              mode={formMode}
              onSave={handleEmployeeSaved}
              onCancel={() => {
                setShowForm(false);
                setEditingEmployee(null);
                setFormMode('add');
              }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading employees...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No employees found</h3>
          <p>Get started by adding your first employee</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true);
              setFormMode('add');
            }}
          >
            Add First Employee
          </button>
        </div>
      ) : (
        <>
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Employees;
