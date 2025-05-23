import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/PageTitle";
import DataTable from "../../components/DataTable";
import ActionButton from "../../components/ActionButton";
import StatusBadge from "../../components/StatusBadge";

const ManageStaff = () => {
  const navigate = useNavigate();
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(123) 456-7890",
      department: "Marketing",
      status: "active",
      avatar: "user.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(987) 654-3210",
      department: "HR",
      status: "active",
      avatar: "user.jpg",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      phone: "(555) 123-4567",
      department: "Sales",
      status: "inactive",
      avatar: "user.jpg",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice.williams@example.com",
      phone: "(333) 222-1111",
      department: "Development",
      status: "active",
      avatar: "user.jpg",
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      phone: "(444) 555-6666",
      department: "Finance",
      status: "active",
      avatar: "user.jpg",
    },
  ]);

  // Delete staff handler
  const handleDeleteStaff = (staffId) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setStaffMembers(staffMembers.filter((staff) => staff.id !== staffId));
    }
  };

  // Table columns configuration
  const columns = [
    {
      field: "name",
      header: "Name",
      render: (value, staff) => (
        <div className="d-flex align-items-center">
          <img
            src={staff.avatar}
            alt={value}
            className="rounded-circle me-2"
            style={{ width: "32px", height: "32px" }}
          />
          <span>{value}</span>
        </div>
      ),
    },
    { field: "email", header: "Email" },
    { field: "phone", header: "Phone" },
    {
      field: "department",
      header: "Department",
      render: (value) => (
        <Badge bg="info" className="text-white">
          {value}
        </Badge>
      ),
    },
    {
      field: "status",
      header: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      field: "actions",
      header: "Actions",
      render: (_, staff) => (
        <div className="action-buttons">
          <ActionButton
            icon={faEdit}
            variant="outline-primary"
            onClick={() => navigate(`/staff/edit-staff/${staff.id}`)}
            title="Edit Staff"
          />
          <ActionButton
            icon={faClock}
            variant="outline-info"
            onClick={() => navigate(`/time-logs?staffId=${staff.id}`)}
            title="View Time Logs"
          />
          <ActionButton
            icon={faTrashAlt}
            variant="outline-danger"
            onClick={() => handleDeleteStaff(staff.id)}
            title="Delete Staff"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="manage-staff">
      <PageTitle
        title="Manage Staff"
        breadcrumbs={[{ text: "Manage Staff" }]}
      />

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="text-xl fw-semibold">Manage Staff</span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/staff/add-staff")}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Add Staff
          </Button>
        </Card.Header>

        <Card.Body>
          <DataTable columns={columns} data={staffMembers} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageStaff;
