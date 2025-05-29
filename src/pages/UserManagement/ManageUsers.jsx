
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';
import PageTitle from '../../components/PageTitle';
import DataTable from '../../components/DataTable';
import ActionButton from '../../components/ActionButton';
import StatusBadge from '../../components/StatusBadge';
import { parseCookies } from 'nookies';
import axios from 'axios';

const ManageUsers = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASE_URL;
  const loggedInUserId = sessionStorage.getItem('LoggedInUserId');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = parseCookies();

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await axios.delete(`${API_URL}delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200 && res.data.success === 1) {
        alert("User deleted successfully");
        setUsers(users.filter(user => user.id !== userId));
      } else {
        alert(res.data.message || "Failed to delete user");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error deleting user";
      alert(msg);
    }
  };

  // Table columns configuration
  const columns = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'role', header: 'Role' },
    {
      field: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      field: 'actions',
      header: 'Actions',
      render: (_, user) => (
        <div className="action-buttons">
          <ActionButton
            icon={faEdit}
            variant="outline-primary"
            onClick={() => navigate(`/users/edit-user/${user.id}`)}
            title="Edit User"
          />
          {String(user.id) !== String(loggedInUserId) && (
            <ActionButton
              icon={faTrashAlt}
              variant="outline-danger"
              onClick={() => handleDeleteUser(user.id)}
              title="Delete User"
            />
          )}
        </div>
      ),
    },
  ];
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.post(`${API_URL}get-all-users`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.status === 200 && res.data.success === 1) {
          const formattedUsers = res.data.data.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || 'N/A',
            role: user.user_roles?.length > 0 ? user.user_roles[0].name : 'N/A',
            status: user.status ? 'active' : 'inactive'
          }));
          setUsers(formattedUsers);
        } else {
          setError('Failed to load users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('An error occurred while fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="manage-users">
      <PageTitle
        title="Manage Users"
        breadcrumbs={[{ text: 'User Management' }, { text: 'Manage Users' }]}
      />

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="text-xl fw-semibold">User List</span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/users/add-user')}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Add User
          </Button>
        </Card.Header>


        <Card.Body>
          <DataTable
            columns={columns}
            data={users}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageUsers;
