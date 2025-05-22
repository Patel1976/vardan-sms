
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import PageTitle from '../../components/PageTitle';
import { Switch } from '../../components/ui/switch';

const RolePermissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState({});
  
  // Sample modules and permissions
  const modules = [
    {
      name: 'Dashboard',
      permissions: ['view']
    },
    {
      name: 'User Management',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Role Management',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Staff Management',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Work Journey',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Emergency Logs',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Time Logs',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Email Templates',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Settings',
      permissions: ['view', 'edit']
    }
  ];
  
  useEffect(() => {
    // In a real app, fetch role and permission data from API
    const roleData = {
      id: 1,
      name: 'Administrator',
      // Initialize with all permissions set to true for demo
      permissions: {}
    };
    
    // Create initial permissions object
    const initialPermissions = {};
    modules.forEach(module => {
      module.permissions.forEach(permission => {
        const key = `${module.name.toLowerCase().replace(/\s+/g, '_')}_${permission}`;
        initialPermissions[key] = true; // Administrator has all permissions
      });
    });
    
    roleData.permissions = initialPermissions;
    setRoleName(roleData.name);
    setPermissions(roleData.permissions);
  }, [id]);
  
  // Handle permission toggle
  const handlePermissionChange = (name, checked) => {
    setPermissions({
      ...permissions,
      [name]: checked
    });
  };
  
  // Handle module toggle (all permissions for a module)
  const handleModuleToggle = (moduleName, checked) => {
    const updatedPermissions = { ...permissions };
    const moduleKey = moduleName.toLowerCase().replace(/\s+/g, '_');
    
    // Find the module and update all its permissions
    const module = modules.find(m => m.name === moduleName);
    if (module) {
      module.permissions.forEach(permission => {
        updatedPermissions[`${moduleKey}_${permission}`] = checked;
      });
    }
    
    setPermissions(updatedPermissions);
  };
  
  // Check if all permissions for a module are enabled
  const isModuleFullyEnabled = (moduleName) => {
    const moduleKey = moduleName.toLowerCase().replace(/\s+/g, '_');
    const module = modules.find(m => m.name === moduleName);
    if (!module) return false;
    
    return module.permissions.every(permission => 
      permissions[`${moduleKey}_${permission}`]
    );
  };
  
  // Check if any permission for a module is enabled
  const isModulePartiallyEnabled = (moduleName) => {
    const moduleKey = moduleName.toLowerCase().replace(/\s+/g, '_');
    const module = modules.find(m => m.name === moduleName);
    if (!module) return false;
    
    const enabledCount = module.permissions.filter(permission => 
      permissions[`${moduleKey}_${permission}`]
    ).length;
    
    return enabledCount > 0 && enabledCount < module.permissions.length;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send data to API
    console.log('Saving permissions:', { id, permissions });
    alert('Permissions updated successfully!');
    navigate('/roles');
  };
  
  return (
    <div className="role-permissions">
      <PageTitle 
        title={`${roleName} Permissions`} 
        breadcrumbs={[
          { text: 'User Management' },
          { text: 'Roles', link: '/roles' },
          { text: 'Permissions' }
        ]} 
      />
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="text-xl fw-semibold">Manage Role Permissions</span>
          <Button 
            variant="light" 
            size="sm"
            onClick={() => navigate('/roles')}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back to Roles
          </Button>
        </Card.Header>
        
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {modules.map((module, index) => (
              <Card key={index} className="mb-3 permission-card">
                <Card.Header className="permission-header">
                  <Form.Check
                    type="switch"
                    id={`module-${index}`}
                    label={<span className="permission-group">{module.name}</span>}
                    checked={isModuleFullyEnabled(module.name)}
                    onChange={(e) => handleModuleToggle(module.name, e.target.checked)}
                    isValid={isModulePartiallyEnabled(module.name)}
                  />
                </Card.Header>
                
                <Card.Body>
                  <Row>
                    {module.permissions.map((permission, permIndex) => (
                      <Col key={permIndex} md={3} sm={6} className="mb-3">
                        <div className="d-flex align-items-center">
                          <Switch 
                            id={`${module.name.toLowerCase().replace(/\s+/g, '_')}_${permission}`}
                            checked={!!permissions[`${module.name.toLowerCase().replace(/\s+/g, '_')}_${permission}`]}
                            onCheckedChange={(checked) => handlePermissionChange(`${module.name.toLowerCase().replace(/\s+/g, '_')}_${permission}`, checked)}
                          />
                          <label htmlFor={`${module.name.toLowerCase().replace(/\s+/g, '_')}_${permission}`} className="ms-2">
                            {permission.charAt(0).toUpperCase() + permission.slice(1)}
                          </label>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            ))}
            
            <Button variant="primary" type="submit">
              <FontAwesomeIcon icon={faSave} className="me-1" />
              Save Permissions
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RolePermissions;
