
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout components
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/UserManagement/ManageUsers';
import AddUser from './pages/UserManagement/AddUser';
import ManageRoles from './pages/UserManagement/ManageRoles';
import AddRole from './pages/UserManagement/AddRole';
import RolePermissions from './pages/UserManagement/RolePermissions';
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

// Wrapper component to determine if layout should be shown
const AppContent = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');
  
  const isAuthPage = ['/login', '/lock-screen'].includes(location.pathname);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Apply theme to body
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
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<AddUser />} />
          <Route path="/roles" element={<ManageRoles />} />
          <Route path="/roles/add" element={<AddRole />} />
          <Route path="/roles/edit/:id" element={<AddRole />} />
          <Route path="/roles/permissions/:id" element={<RolePermissions />} />
          <Route path="/staff" element={<ManageStaff />} />
          <Route path="/staff/add" element={<AddStaff />} />
          <Route path="/staff/edit/:id" element={<AddStaff />} />
          <Route path="/work-journey" element={<WorkJourney />} />
          <Route path="/emergency-logs" element={<EmergencyLogs />} />
          <Route path="/time-logs" element={<TimeLogs />} />
          <Route path="/email-templates" element={<EmailTemplates />} />
          <Route path="/email-templates/add" element={<AddEmailTemplate />} />
          <Route path="/email-templates/edit/:id" element={<AddEmailTemplate />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
