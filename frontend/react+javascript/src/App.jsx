import { useState } from 'react';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>HRMS Lite</h1>
          <p className="subtitle">Human Resource Management System</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          👥 Employees
        </button>
        <button
          className={`nav-button ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          📅 Attendance
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'employees' && <Employees />}
        {activeTab === 'attendance' && <Attendance />}
      </main>
    </div>
  );
}

export default App;
