import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarContent from "./sidebar/SidebarContent";

const Sidebar = ({ isOpen, setIsOpen, setSidebarOpen, setHovering, theme }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [expandedMenus, setExpandedMenus] = useState({
    userManagement: false,
    staffManagement: false,
    reports: false,
    settings: false,
  });

  const handleMouseEnter = () => {
    if (!isMobile) {
      setHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHovering(false);
    }
  };

  // Check the current path and expand the relevant menu
  useEffect(() => {
    const currentPath = location.pathname;
    setExpandedMenus((prev) => {
      return {
        "User Managment": currentPath.startsWith("/users"),
        "Staff Managment": currentPath.startsWith("/staff") || currentPath.startsWith("/workjourney"),
        Reports: currentPath.startsWith("/emergency-logs") || currentPath.startsWith("/timelogs"),
        Settings: currentPath.startsWith("/email-template"),
      };
    });
  }, [location.pathname]);

  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => {
      const isCurrentlyOpen = prev[menu];
      return {
        userManagement: false,
        staffManagement: false,
        reports: false,
        settings: false,
        [menu]: !isCurrentlyOpen,
      };
    });
  };

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`sidebar bg-sidebar text-sidebar-foreground ${!isOpen ? "mini" : ""
        } ${isMobile && isOpen ? "mobile-open" : ""}`}
    >
      <SidebarHeader
        isOpen={isOpen}
        isMobile={isMobile}
        setIsOpen={setIsOpen}
      />

      <SidebarContent
        expandedMenus={expandedMenus}
        toggleSubmenu={toggleSubmenu}
        isOpen={isOpen}
        isMobile={isMobile}
        setSidebarOpen={setSidebarOpen}
      />
    </aside>
  );
};

export default Sidebar;
