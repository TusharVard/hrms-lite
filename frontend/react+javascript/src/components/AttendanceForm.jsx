import { useState } from 'react';
import apiClient from '../config/axios';
import './AttendanceForm.css';

function AttendanceForm({ employees, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    breakStart: '',
    breakEnd: '',
    status: 'PRESENT',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleDateTimeChange = (name, value) => {
    // Convert date input to ISO format
    if (value) {
      const date = new Date(value);
      setFormData((prev) => ({
        ...prev,
        [name]: date.toISOString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        employeeId: formData.employeeId,
        date: formData.date,
        status: formData.status,
        notes: formData.notes || null,
      };

      // Add time fields if provided
      if (formData.checkIn) {
        const checkInDate = new Date(`${formData.date}T${formData.checkIn}`);
        payload.checkIn = checkInDate.toISOString();
      }
      if (formData.checkOut) {
        const checkOutDate = new Date(`${formData.date}T${formData.checkOut}`);
        payload.checkOut = checkOutDate.toISOString();
      }
      if (formData.breakStart) {
        const breakStartDate = new Date(`${formData.date}T${formData.breakStart}`);
        payload.breakStart = breakStartDate.toISOString();
      }
      if (formData.breakEnd) {
        const breakEndDate = new Date(`${formData.date}T${formData.breakEnd}`);
        payload.breakEnd = breakEndDate.toISOString();
      }

      const response = await apiClient.post('/attendance', payload);

      if (response.data.success) {
        onSave();
      } else {
        throw new Error(response.data.message || 'Failed to mark attendance');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="attendance-form" onSubmit={handleSubmit}>
      {error && (
        <div className="form-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="employeeId">
          Employee <span className="required">*</span>
        </label>
        <select
          id="employeeId"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.employeeId} - {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">
            Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">
            Status <span className="required">*</span>
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="status"
                value="PRESENT"
                checked={formData.status === 'PRESENT'}
                onChange={handleChange}
              />
              <span>Present</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="status"
                value="LATE"
                checked={formData.status === 'LATE'}
                onChange={handleChange}
              />
              <span>Late</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="status"
                value="ABSENT"
                checked={formData.status === 'ABSENT'}
                onChange={handleChange}
              />
              <span>Absent</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="status"
                value="HALF_DAY"
                checked={formData.status === 'HALF_DAY'}
                onChange={handleChange}
              />
              <span>Half Day</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="status"
                value="ON_LEAVE"
                checked={formData.status === 'ON_LEAVE'}
                onChange={handleChange}
              />
              <span>On Leave</span>
            </label>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="checkIn">Check In</label>
          <input
            type="time"
            id="checkIn"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="checkOut">Check Out</label>
          <input
            type="time"
            id="checkOut"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="breakStart">Break Start</label>
          <input
            type="time"
            id="breakStart"
            name="breakStart"
            value={formData.breakStart}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="breakEnd">Break End</label>
          <input
            type="time"
            id="breakEnd"
            name="breakEnd"
            value={formData.breakEnd}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="form-input"
          placeholder="Optional notes about the attendance..."
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Mark Attendance'}
        </button>
      </div>
    </form>
  );
}

export default AttendanceForm;
