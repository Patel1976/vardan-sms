import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import {
  faTachometerAlt,
  faUsers,
  faUserShield,
  faUserTie,
  faMapMarkedAlt,
  faExclamationTriangle,
  faClock,
  faCog,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";
import SidebarMenuItem from "./SidebarMenuItem";

const SidebarContent = ({
  expandedMenus,
  toggleSubmenu,
  isOpen,
  isMobile,
  setSidebarOpen,
}) => {
  return (
    <div className="sidebar-content">
      <ul className="nav flex-column">
        {/* Dashboard */}
        <li className="nav-item">
          <NavLink
            to="/"
            className="nav-link text-sidebar-foreground"
            end
            onClick={() => {
              if (isMobile) {
                setSidebarOpen(false);
              }
            }}
          >
            <FontAwesomeIcon icon={faTachometerAlt} />
            {isOpen && <span className="nav-text ms-2">Dashboard</span>}
          </NavLink>
        </li>

        {/* User Management */}
        <SidebarMenuItem
          menuKey="userManagement"
          isOpen={expandedMenus.userManagement}
          toggleSubmenu={toggleSubmenu}
          icon={faUsers}
          title="User Management"
          isFullWidth={isOpen}
          submenuItems={[{ path: "/users", title: "Manage Users" }]}
          isMobile={isMobile}
          setIsOpen={setSidebarOpen}
        />

        {/* Staff Management */}
        <SidebarMenuItem
          menuKey="staffManagement"
          isOpen={expandedMenus.staffManagement}
          toggleSubmenu={toggleSubmenu}
          icon={faUserTie}
          title="Staff Management"
          isFullWidth={isOpen}
          submenuItems={[
            { path: "/staff", title: "Manage Staff" },
            { path: "/workjourney", title: "Work Journey" },
          ]}
          isMobile={isMobile}
          setIsOpen={setSidebarOpen}
        />

        {/* Reports */}
        <SidebarMenuItem
          menuKey="reports"
          isOpen={expandedMenus.reports}
          toggleSubmenu={toggleSubmenu}
          icon={faExclamationTriangle}
          title="Reports"
          isFullWidth={isOpen}
          submenuItems={[
            { path: "/emergency-logs", title: "Emergency Logs" },
            { path: "/timelogs", title: "Time Logs" },
          ]}
          isMobile={isMobile}
          setIsOpen={setSidebarOpen}
        />

        {/* Settings */}
        <SidebarMenuItem
          menuKey="settings"
          isOpen={expandedMenus.settings}
          toggleSubmenu={toggleSubmenu}
          icon={faCog}
          title="Settings"
          isFullWidth={isOpen}
          submenuItems={[
            { path: "/email-templates", title: "Email Templates" },
          ]}
          isMobile={isMobile}
          setIsOpen={setSidebarOpen}
        />
      </ul>
    </div>
  );
};

export default SidebarContent;
