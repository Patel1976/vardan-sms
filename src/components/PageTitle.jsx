import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import DynamicBreadcrumb from "./DynamicBreadcrumb";

const PageTitle = ({ title, breadcrumbs = [] }) => {
  return (
    <>
      <DynamicBreadcrumb breadcrumbs={breadcrumbs} />
    </>
  );
};

export default PageTitle;
