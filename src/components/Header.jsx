
import React, { useEffect, useState, useRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faUser,
  faSignOutAlt,
  faCog,
  faMoon,
  faSun,
  faLock,
  faUserCog,
  faEnvelope,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { parseCookies, destroyCookie } from 'nookies';
import axios from 'axios';



const Header = ({ toggleSidebar, theme, toggleTheme }) => {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const isMounted = useRef(false);
  const { token } = parseCookies();

  const handleLogout = async () => {
    try {

      await axios.post(`${API_URL}auth/logout`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      localStorage.removeItem("email");
      sessionStorage.removeItem("Role");
      destroyCookie(null, 'token');
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(`${API_URL}user-profile`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.success === 1) {
          const user = response.data.data;
          setUserName(user.name);
          setUserImage(
            user.image
              ? `data:image/jpeg;base64,${user.image}`
              : '/placeholder.png'
          );
          sessionStorage.setItem('Role', response.data.role);
          sessionStorage.setItem('LoggedInUserId', user.id);

          const encodedPermissions = btoa(JSON.stringify(response.data.permissions));
          sessionStorage.setItem('Permissions', encodedPermissions);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (!isMounted.current) {
      fetchUser();
      isMounted.current = true;
    }
  }, [API_URL]);
  return (
    <header className="header" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
      <div className="d-flex align-items-center">
        <button
          className="toggle-button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className="d-flex align-items-center gap-4">
        {/* Theme toggle button */}
        <button
          className="theme-toggle bg-transparent border-0"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          <FontAwesomeIcon
            icon={theme === "light" ? faMoon : faSun}
            className="fs-5 dark-light-button"
          />
        </button>

        {/* User profile dropdown */}
        <Dropdown className="user-profile">
          <Dropdown.Toggle
            as="div"
            className="bg-transparent border-0 d-flex align-items-center"
          >
            <div
              className="d-flex align-items-center"
              role="button"
              style={{ cursor: "pointer" }}
            >
              <div className="user-avatar-container">
                <img
                  src={userImage}
                  alt="User"
                  className="user-avatar"
                />
              </div>
              <span className="user-name d-none d-md-inline ms-2">{userName}</span>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu
            align="end"
            className={`py-0 ${theme === "dark" ? "dropdown-menu-dark" : ""}`}
          >
            <div
              className={`px-3 py-2 border-bottom ${theme === "dark" ? "bg-dark border-secondary" : "bg-light"
                }`}
            >
              <div className="fw-bold">{userName}</div>
            </div>

            <Dropdown.Item as={Link} to="/profile">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              My Profile
            </Dropdown.Item>

            <Dropdown.Item as={Link} to="/lock-screen">
              <FontAwesomeIcon icon={faLock} className="me-2" />
              Lock Screen
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item onClick={handleLogout} className="text-danger">
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
