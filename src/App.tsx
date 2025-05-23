// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/UserManagement/ManageUsers';
import AddUser from './pages/UserManagement/AddUser';
import ManageStaff from './pages/StaffManagement/ManageStaff';
import AddStaff from './pages/StaffManagement/AddStaff';
import WorkJourney from './pages/StaffManagement/WorkJourney';
import EmergencyLogs from './pages/Reports/EmergencyLogs';
import TimeLogs from './pages/Reports/TimeLogs';
import EmailTemplates from './pages/Settings/EmailTemplates';
import AddEmailTemplate from './pages/Settings/AddEmailTemplate';
import MyProfile from './pages/Profile/MyProfile';
import Login from './pages/Auth/Login';
import LockScreen from './pages/Auth/LockScreen';
import NotFound from './pages/NotFound';

const AppContent = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');

  const isAuthPage = ['/login', '/lock-screen'].includes(location.pathname);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  if (isAuthPage) {
    return (
      <div className={`app ${theme}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/lock-screen" element={<LockScreen />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`}>
      <Layout
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        theme={theme}
        toggleTheme={toggleTheme}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/users/add-user" element={<AddUser />} />
          <Route path="/users/edit-user/:id" element={<AddUser />} />
          <Route path="/staff" element={<ManageStaff />} />
          <Route path="/staff/add-staff" element={<AddStaff />} />
          <Route path="/staff/edit-staff/:id" element={<AddStaff />} />
          <Route path="/workjourney" element={<WorkJourney />} />
          <Route path="/emergency-logs" element={<EmergencyLogs />} />
          <Route path="/timelogs" element={<TimeLogs />} />
          <Route path="/email-templates" element={<EmailTemplates />} />
          <Route path="/email-templates/add-email-template" element={<AddEmailTemplate />} />
          <Route path="/email-templates/edit-email-template/:id" element={<AddEmailTemplate />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
