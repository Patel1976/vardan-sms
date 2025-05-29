import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import SidebarMenuItem from "./SidebarMenuItem";
import {
  faTachometerAlt,
  faUsers,
  faUserShield,
  faUserTie,
  faMapMarkedAlt,
  faExclamationTriangle,
  faClock,
  faCog,
  faCube,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";
import { parseCookies } from 'nookies';

const iconMap = {
  "tachometer-alt": faTachometerAlt,
  users: faUsers,
  "user-tie": faUserTie,
  "exclamation-triangle": faExclamationTriangle,
  cog: faCog,
};

const SidebarContent = ({
  expandedMenus,
  toggleSubmenu,
  isOpen,
  isMobile,
  setSidebarOpen,
}) => {
  const [menuData, setMenuData] = useState([]);
  const API_URL = import.meta.env.VITE_BASE_URL;
  const { token } = parseCookies();
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.post(`${API_URL}get-all-user-module`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setMenuData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch sidebar modules:", error);
      }
    };
    fetchModules();
  }, []);

  return (
    <div className="sidebar-content">
      <ul className="nav flex-column">
        {menuData
          .filter((module) => module.parent_module_id === null)
          .map((mainModule) => {
            const icon = iconMap[mainModule.icon] || faCube;
            const subModules = mainModule.sub_modules || [];

            if (subModules.length > 0) {
              return (
                <SidebarMenuItem
                  key={mainModule.id}
                  menuKey={mainModule.slug || mainModule.name}
                  isOpen={expandedMenus[mainModule.slug || mainModule.name]}
                  toggleSubmenu={toggleSubmenu}
                  icon={icon}
                  title={mainModule.name}
                  isFullWidth={isOpen}
                  submenuItems={subModules}
                  isMobile={isMobile}
                  setIsOpen={setSidebarOpen}
                />
              );
            } else {
              return (
                <li key={mainModule.id} className="nav-item">
                  <NavLink
                    to={`/${mainModule.slug}`}
                    className="nav-link text-sidebar-foreground"
                    end
                  >
                    <FontAwesomeIcon icon={icon} />
                    {isOpen && (
                      <span className="nav-text ms-2">{mainModule.name}</span>
                    )}
                  </NavLink>
                </li>
              );
            }
          })}
      </ul>
    </div>
  );
};

export default SidebarContent;
