import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-fluid">
        <span>&copy; {currentYear} Vardan Staff Management System.</span>
      </div>
    </footer>
  );
};

export default Footer;
