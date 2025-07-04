import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const SidebarHeader = ({ isOpen, isMobile, setIsOpen }) => {
  const handleCloseClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className="sidebar-header border-sidebar-border d-flex justify-content-center">
      <div className="logo-container">
        <Link to="/dashboard">
          {isOpen ? (
            <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          ) : (
            <img src="/favicon.png" alt="Logo" className="sidebar-logo" />
          )}
        </Link>
      </div>
      {isMobile && isOpen && (
        <button
          className="close-sidebar-mobile text-sidebar-foreground"
          onClick={handleCloseClick}
          aria-label="Close sidebar"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  );
};

export default SidebarHeader;
