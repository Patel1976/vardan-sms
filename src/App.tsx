
import React, { useState, useEffect, FC } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { parseCookies } from 'nookies';

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
import ForgetPassword from './pages/Auth/ForgetPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import NotFound from './pages/NotFound';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');

  const isAuthPage = ['/login', '/lock-screen', '/forget-password', '/reset-password'].some(path =>
    location.pathname.startsWith(path)
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const { token } = parseCookies();
    const emailSaved = localStorage.getItem('email');
    const publicRoutes = ['/login', '/lock-screen', '/forget-password', '/reset-password'];

    const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));

    if (!token && !isPublicRoute) {
      if (emailSaved) {
        navigate('/lock-screen', { replace: true });
      } else {
        alert('You are not authenticated. Please log in.');
        navigate('/login', { replace: true });
      }
    }
  }, [location.pathname]);

  if (isAuthPage) {
    return (
      <div className={`app ${theme}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/lock-screen" element={<LockScreen />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
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
          {/* Redirect root path based on auth status */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/lock-screen" element={<LockScreen />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/users" element={<ProtectedRoute element={<ManageUsers />} />} />
          <Route path="/users/add-user" element={<ProtectedRoute element={<AddUser />} />} />
          <Route path="/users/edit-user/:id" element={<ProtectedRoute element={<AddUser />} />} />
          <Route path="/staff" element={<ProtectedRoute element={<ManageStaff />} />} />
          <Route path="/staff/add-staff" element={<ProtectedRoute element={<AddStaff />} />} />
          <Route path="/staff/edit-staff/:id" element={<ProtectedRoute element={<AddStaff />} />} />
          <Route path="/workjourney" element={<ProtectedRoute element={<WorkJourney />} />} />
          <Route path="/emergency-logs" element={<ProtectedRoute element={<EmergencyLogs />} />} />
          <Route path="/timelogs" element={<ProtectedRoute element={<TimeLogs />} />} />
          <Route path="/email-template" element={<ProtectedRoute element={<EmailTemplates />} />} />
          <Route path="/email-template/add" element={<ProtectedRoute element={<AddEmailTemplate />} />} />
          <Route path="/email-template/edit/:id" element={<ProtectedRoute element={<AddEmailTemplate />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<MyProfile />} />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
};

const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;