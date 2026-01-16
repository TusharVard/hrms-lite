import { useState, useEffect } from 'react';
import AttendanceForm from '../components/AttendanceForm';
import apiClient from '../config/axios';
import './Attendance.css';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Filters
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get('/employees', {
        params: { limit: 100 },
      });
      
      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  // Fetch attendance records
  const fetchAttendance = async () => {
    if (!selectedEmployee) {
      setAttendanceRecords([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (statusFilter) params.status = statusFilter;

      const response = await apiClient.get(`/attendance/employee/${selectedEmployee}`, {
        params,
      });
      
      if (response.data.success) {
        setAttendanceRecords(response.data.data.attendances || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch attendance');
      }
    } catch (err) {
      setError(err.message);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [selectedEmployee, startDate, endDate, statusFilter]);

  const handleAttendanceSaved = () => {
    setShowForm(false);
    fetchAttendance();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      PRESENT: 'badge-success',
      ABSENT: 'badge-danger',
      LATE: 'badge-warning',
      HALF_DAY: 'badge-info',
      ON_LEAVE: 'badge-default',
    };
    return statusClasses[status] || 'badge-default';
  };

  const clearFilters = () => {
    setSelectedEmployee('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
  };

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h1>Attendance Management</h1>
          <p className="subtitle">Track and manage employee attendance</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          + Mark Attendance
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="employee-select">Employee</label>
            <select
              id="employee-select"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="filter-input"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employeeId} - {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="start-date">Start Date</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="end-date">End Date</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-input"
            >
              <option value="">All Status</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-secondary btn-clear"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={fetchAttendance}>Retry</button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Mark Attendance</h2>
              <button
                className="btn-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <AttendanceForm
              employees={employees}
              onSave={handleAttendanceSaved}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {!selectedEmployee ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>Select an employee to view attendance</h3>
          <p>Choose an employee from the dropdown above to see their attendance records</p>
        </div>
      ) : loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading attendance records...</p>
        </div>
      ) : attendanceRecords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No attendance records found</h3>
          <p>No attendance records match your filters</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Mark Attendance
          </button>
        </div>
      ) : (
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Break</th>
                <th>Working Hours</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record.id}>
                  <td className="date-cell">{formatDate(record.date)}</td>
                  <td>{formatDateTime(record.checkIn)}</td>
                  <td>{formatDateTime(record.checkOut)}</td>
                  <td>
                    {record.breakStart && record.breakEnd ? (
                      <span>
                        {formatDateTime(record.breakStart)} - {formatDateTime(record.breakEnd)}
                        {record.breakDuration && (
                          <span className="break-duration"> ({record.breakDuration}h)</span>
                        )}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="hours-cell">
                    {record.workingHours ? (
                      <strong>{record.workingHours}h</strong>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="notes-cell">{record.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Attendance;
