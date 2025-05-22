import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const routeNameMap = {
  "": "Home",
  users: "Manage Users",
  add: "Add User",
  edit: "Edit User",
  roles: "Manage Roles",
  permissions: "Role Permissions",
  staff: "Manage Staff",
  "work-journey": "Work Journey",
  "emergency-logs": "Emergency Logs",
  "time-logs": "Time Logs",
  "email-templates": "Email Templates",
  profile: "My Profile",
};

const DynamicBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="breadcrumb-container">
      <Breadcrumb>
        <BreadcrumbList className="breadcrumb-list">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="breadcrumb-link">
                <FontAwesomeIcon
                  icon={faHouse}
                  className="breadcrumb-home-icon"
                />
                <span style={{ marginLeft: "2px" }}>Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {pathnames.map((segment, index) => {
            if (/^\d+$/.test(segment)) return null;

            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const title = routeNameMap[segment] || segment;

            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator className="breadcrumb-separator">
                  /
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="breadcrumb-page">
                      {title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo} className="breadcrumb-link">
                        {title}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default DynamicBreadcrumb;
