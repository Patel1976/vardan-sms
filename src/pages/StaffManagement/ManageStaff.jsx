import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Badge, Spinner } from "react-bootstrap";
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
import axios from "axios";
import { parseCookies } from "nookies";

const ManageStaff = () => {
  const navigate = useNavigate();
  const API_URL_STAFF = import.meta.env.VITE_BASE_URL_STAFF;
  const IMAGE_URL = import.meta.env.VITE_IMAGE_UPLOAD_URL;
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = parseCookies();

  // Delete staff handler
  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      const res = await axios.delete(`${API_URL_STAFF}delete-staff-user/${staffId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      if (res.status === 200 && res.data.success === 1) {
        alert("Staff member deleted successfully");
        setStaffMembers(staffMembers.filter((staff) => staff.id !== staffId));
      } else {
        alert(res.data.message || "Failed to delete staff member");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error deleting staff member";
      alert(msg);
    }
  };

  // Table columns configuration
  const columns = [
    {
      field: "avatar",
      header: "Photo",
      className: "photo-column",
      render: (value, staff) => (
        <img
          src={staff.avatar}
          alt={staff.name}
          className="rounded-circle"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
      ),
    },
    {
      field: "name",
      header: "Name",
      render: (value) => <span>{value}</span>,
    },
    { field: "email", header: "Email" },
    { field: "phone", header: "Phone" },
    { field: "department", header: "Department" },
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
            onClick={() => navigate(`/timelogs?staffId=${staff.id}`)}
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

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${API_URL_STAFF}get-all-staff-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200 && res.data.success === 1) {
          const formattedStaff = res.data.data.map((staff) => ({
            id: staff.id,
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            department: staff.department,
            avatar: staff.image
              ? `${IMAGE_URL}${staff.image}`
              : "placeholder.png",
          }));
          setStaffMembers(formattedStaff);
        } else {
          setError("Failed to load Staff Members");
        }
      } catch (error) {
        console.error("Error fetching staff members:", error);
        setError("An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

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
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <DataTable columns={columns} data={staffMembers} />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageStaff;
