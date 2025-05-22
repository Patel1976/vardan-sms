
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useIsMobile } from '../hooks/use-mobile';

const Layout = ({
  children,
  theme,
  toggleTheme,
}) => {
  const isMobile = useIsMobile();

  // Separate states
  const [sidebarPinned, setSidebarPinned, setIsOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const isSidebarOpen = sidebarPinned || sidebarHovered;

  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarPinned(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarPinned((prev) => !prev);
  };

  const handleOverlayClick = () => {
    if (isMobile && isSidebarOpen) {
      setSidebarPinned(false);
    }
  };

  return (
    <div
      className={`main-layout ${
        isMobile && isSidebarOpen ? "overlay-active" : ""
      }`}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        setHovering={setSidebarHovered}
        theme={theme}
        setIsOpen={setIsOpen}
      />

      <div className="content-area">
        <Header
          toggleSidebar={toggleSidebar}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="main-content">{children}</main>

        <Footer />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={handleOverlayClick}></div>
      )}
    </div>
  );
};

export default Layout;
