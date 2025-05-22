import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const SidebarMenuItem = ({
  menuKey,
  isOpen,
  toggleSubmenu,
  icon,
  title,
  submenuItems = [],
  isFullWidth = true,
  isMobile,
  setIsOpen,
}) => {
  const navigate = useNavigate();
  const handleSubmenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <li className="nav-item">
      <div
        className={`nav-link submenu-toggler text-sidebar-foreground ${
          isOpen
            ? "active bg-sidebar-accent text-sidebar-accent-foreground"
            : ""
        }`}
        onClick={() => toggleSubmenu(menuKey)}
      >
        <div>
          <FontAwesomeIcon icon={icon} />
          {isFullWidth && <span className="nav-text ms-2">{title}</span>}
        </div>
        {isFullWidth && (
          <FontAwesomeIcon
            icon={isOpen ? faChevronDown : faChevronRight}
            className="arrow-icon"
          />
        )}
      </div>

      {isOpen && isFullWidth && (
        <ul className={`submenu ${isOpen && isFullWidth ? "open" : ""}`}>
          {submenuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                onClick={() => handleSubmenuClick(item.path)}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "active text-sidebar-primary"
                      : "text-sidebar-foreground"
                  }`
                }
              >
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarMenuItem;
