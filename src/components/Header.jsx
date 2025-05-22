
import React from 'react';
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

const Header = ({ toggleSidebar, theme, toggleTheme }) => {
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
                  src="/public/profile.jpg"
                  alt="User"
                  className="user-avatar"
                />
              </div>
              <span className="user-name d-none d-md-inline ms-2">Admin</span>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu
            align="end"
            className={`py-0 ${theme === "dark" ? "dropdown-menu-dark" : ""}`}
          >
            <div
              className={`px-3 py-2 border-bottom ${
                theme === "dark" ? "bg-dark border-secondary" : "bg-light"
              }`}
            >
              <div className="fw-bold">Admin</div>
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

            <Dropdown.Item as={Link} to="/login" className="text-danger">
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
