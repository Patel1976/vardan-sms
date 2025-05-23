import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faUserShield,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/PageTitle";
import DataTable from "../../components/DataTable";
import ActionButton from "../../components/ActionButton";
import StatusBadge from "../../components/StatusBadge";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(123) 456-7890",
      role: "Administrator",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(987) 654-3210",
      role: "Manager",
      status: "active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      phone: "(555) 123-4567",
      role: "Editor",
      status: "inactive",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice.williams@example.com",
      phone: "(333) 222-1111",
      role: "Viewer",
      status: "pending",
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      phone: "(444) 555-6666",
      role: "Manager",
      status: "blocked",
    },
  ]);

  // Delete user handler
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  // Table columns configuration
  const columns = [
    { field: "name", header: "Name" },
    { field: "email", header: "Email" },
    { field: "phone", header: "Phone" },
    { field: "role", header: "Role" },
    {
      field: "status",
      header: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      field: "actions",
      header: "Actions",
      render: (_, user) => (
        <div className="action-buttons">
          <ActionButton
            icon={faEdit}
            variant="outline-primary"
            onClick={() => navigate(`/users/edit-user/${user.id}`)}
            title="Edit User"
          />
          <ActionButton
            icon={faTrashAlt}
            variant="outline-danger"
            onClick={() => handleDeleteUser(user.id)}
            title="Delete User"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="manage-users">
      <PageTitle
        title="Manage Users"
        breadcrumbs={[{ text: "Manage Users" }]}
      />

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="text-xl fw-semibold">Manage Users</span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/users/add-user")}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Add User
          </Button>
        </Card.Header>

        <Card.Body>
          <DataTable columns={columns} data={users} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageUsers;
