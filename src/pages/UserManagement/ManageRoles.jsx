
import React, { useState } from 'react';
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

const ManageRoles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([
    { 
      id: 1, 
      name: 'Administrator'
    },
    { 
      id: 2, 
      name: 'Manager'
    },
    { 
      id: 3, 
      name: 'Editor'
    },
    { 
      id: 4, 
      name: 'Viewer'
    },
  ]);

  // Delete role handler
  const handleDeleteRole = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };
  
  // View permissions handler
  const handleViewPermissions = (roleId) => {
    navigate(`/roles/permissions/${roleId}`);
  };

  // Table columns configuration
  const columns = [
    { field: 'name', header: 'Role Name' },
    { 
      field: 'actions', 
      header: 'Actions',
      render: (_, role) => (
        <div className="action-buttons">
          <ActionButton 
            icon={faEdit} 
            variant="outline-primary" 
            onClick={() => navigate(`/roles/edit/${role.id}`)} 
            title="Edit Role"
          />
          <ActionButton 
            icon={faUserShield} 
            variant="outline-info" 
            onClick={() => handleViewPermissions(role.id)} 
            title="Assign Permissions"
          />
          <ActionButton 
            icon={faTrashAlt} 
            variant="outline-danger" 
            onClick={() => handleDeleteRole(role.id)} 
            title="Delete Role"
          />
        </div>
      )
    },
  ];

  return (
    <div className="manage-roles">
      <PageTitle 
        title="Manage Roles" 
        breadcrumbs={[{ text: 'User Management' }, { text: 'Manage Roles' }]} 
      />
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="text-xl fw-semibold">Role List</span>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => navigate('/roles/add')}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Add Role
          </Button>
        </Card.Header>
        
        <Card.Body>
          <DataTable 
            columns={columns} 
            data={roles} 
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageRoles;
