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
import { faHouse, faAnglesRight } from "@fortawesome/free-solid-svg-icons";

const DynamicBreadcrumb = ({ breadcrumbs = [] }) => {
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

          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator className="breadcrumb-separator">
                  <FontAwesomeIcon icon={faAnglesRight} />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="breadcrumb-page">
                      {crumb.text}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.link} className="breadcrumb-link">
                        {crumb.text}
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
