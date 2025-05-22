import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  FormCheck,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/PageTitle";
import { Switch } from "../../components/ui/switch";

const AddRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: {},
  });

  const [validated, setValidated] = useState(false);

  // Sample permissions for checkboxes
  const modules = [
    {
      name: "Dashboard",
      permissions: ["view"],
    },
    {
      name: "User Management",
      permissions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Role Management",
      permissions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Staff Management",
      permissions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Work Journey",
      permissions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Emergency Logs",
      permissions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Time Logs",
      permissions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Email Templates",
      permissions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Settings",
      permissions: ["view", "edit"],
    },
  ];

  // If in edit mode, load role data
  useEffect(() => {
    if (isEditMode) {
      // In a real app, fetch role data from API using ID
      // For demo, we're using mock data
      const roleData = {
        name: "Administrator",
        description: "Full system access",
        permissions: {
          view_users: true,
          add_users: true,
          edit_users: true,
          delete_users: true,
          view_staff: true,
          add_staff: true,
          edit_staff: true,
          delete_staff: true,
          view_reports: true,
          export_reports: true,
          view_settings: true,
          edit_settings: true,
          manage_templates: true,
        },
      };

      setFormData(roleData);
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle permission toggle
  const handlePermissionChange = (name, checked) => {
    setFormData((prevData) => ({
      ...prevData,
      permissions: {
        ...prevData.permissions,
        [name]: checked,
      },
    }));
  };

  // Handle module toggle (all permissions for a module)
  const handleModuleToggle = (moduleName, checked) => {
    const updatedPermissions = { ...formData.permissions };
    const moduleKey = moduleName.toLowerCase().replace(/\s+/g, "_");

    // Find the module and update all its permissions
    const module = modules.find((m) => m.name === moduleName);
    if (module) {
      module.permissions.forEach((permission) => {
        updatedPermissions[`${moduleKey}_${permission}`] = checked;
      });
    }

    setFormData((prevData) => ({
      ...prevData,
      permissions: updatedPermissions,
    }));
  };

  // Check if all permissions for a module are enabled
  const isModuleFullyEnabled = (moduleName) => {
    const moduleKey = moduleName.toLowerCase().replace(/\s+/g, "_");
    const module = modules.find((m) => m.name === moduleName);
    if (!module) return false;

    return module.permissions.every(
      (permission) => formData.permissions[`${moduleKey}_${permission}`]
    );
  };

  // Check if any permission for a module is enabled
  const isModulePartiallyEnabled = (moduleName) => {
    const moduleKey = moduleName.toLowerCase().replace(/\s+/g, "_");
    const module = modules.find((m) => m.name === moduleName);
    if (!module) return false;

    const enabledCount = module.permissions.filter(
      (permission) => formData.permissions[`${moduleKey}_${permission}`]
    ).length;

    return enabledCount > 0 && enabledCount < module.permissions.length;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    // Check form validity
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // In a real app, send data to API
    console.log("Form submitted with data:", formData);

    // Redirect back to roles list
    navigate("/roles");
  };

  return (
    <div className="add-role">
      <PageTitle
        title={isEditMode ? "Edit Role" : "Add Role"}
        breadcrumbs={[
          { text: "User Management", link: "/roles" },
          { text: isEditMode ? "Edit Role" : "Add Role" },
        ]}
      />

      <Card>
        <Card.Header className="d-flex align-items-center justify-content-between">
          <div className="text-xl fw-semibold">
            {isEditMode ? "Edit Role" : "Add New Role"}
          </div>
          <Button
            variant="secondary"
            className="ms-auto"
            onClick={() => navigate("/roles")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back
          </Button>
        </Card.Header>

        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="roleName">
                  <Form.Label>Role Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter role name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Role name is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-4 mb-3">Role Permissions</h5>

            <div className="permissions-container">
              {modules.map((module, index) => (
                <Card key={index} className="mb-3 permission-card">
                  <Card.Header className="permission-header">
                    <Form.Check
                      type="switch"
                      id={`module-${index}`}
                      label={
                        <span className="permission-group">{module.name}</span>
                      }
                      checked={isModuleFullyEnabled(module.name)}
                      onChange={(e) =>
                        handleModuleToggle(module.name, e.target.checked)
                      }
                      isValid={isModulePartiallyEnabled(module.name)}
                    />
                  </Card.Header>

                  <Card.Body>
                    <Row>
                      {module.permissions.map((permission, permIndex) => (
                        <Col key={permIndex} md={3} sm={6} className="mb-3">
                          <div className="d-flex align-items-center">
                            <Switch
                              id={`${module.name
                                .toLowerCase()
                                .replace(/\s+/g, "_")}_${permission}`}
                              checked={
                                !!formData.permissions[
                                  `${module.name
                                    .toLowerCase()
                                    .replace(/\s+/g, "_")}_${permission}`
                                ]
                              }
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  `${module.name
                                    .toLowerCase()
                                    .replace(/\s+/g, "_")}_${permission}`,
                                  checked
                                )
                              }
                            />
                            <label
                              htmlFor={`${module.name
                                .toLowerCase()
                                .replace(/\s+/g, "_")}_${permission}`}
                              className="ms-2"
                            >
                              {permission.charAt(0).toUpperCase() +
                                permission.slice(1)}
                            </label>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>

            <div className="d-flex gap-2 mt-4">
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSave} className="me-1" />
                {isEditMode ? "Update Role" : "Save Role"}
              </Button>

              <Button variant="secondary" onClick={() => navigate("/roles")}>
                <FontAwesomeIcon icon={faTimes} className="me-1" />
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddRole;
