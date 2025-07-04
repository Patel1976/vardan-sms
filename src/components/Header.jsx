
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faUser,
  faSignOutAlt,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { parseCookies, destroyCookie } from 'nookies';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const Header = ({ toggleSidebar, theme, toggleTheme }) => {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const { token } = parseCookies();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

      await axios.post(`${API_URL}auth/logout`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      localStorage.removeItem("user");
      sessionStorage.removeItem("Role");
      destroyCookie(null, 'token');
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const name = user?.name || '';
  const email = user?.email || '';
  const image = user?.image || '';
  const userImage = image
    ? `data:image/jpeg;base64,${image}`
    : '/placeholder.png';

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
              <span className="user-name d-none d-md-inline ms-2">{name}</span>
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
              <div className="fw-bold">{name}</div>
              <div style={{ fontSize: "14px" }}>{email}</div>
            </div>

            <Dropdown.Item as={Link} to="/profile">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              My Profile
            </Dropdown.Item>

            <Dropdown.Divider className='m-0' />

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
