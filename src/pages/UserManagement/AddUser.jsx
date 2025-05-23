import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Nav,
  Tab,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSave,
  faTimes,
  faArrowLeft,
  faUser,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/PageTitle";

const AddUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "",
    status: "active",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [validated, setValidated] = useState(false);

  const roles = [
    { id: 1, name: "Administrator" },
    { id: 2, name: "Manager" },
    { id: 3, name: "Editor" },
    { id: 4, name: "Viewer" },
  ];

  const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "blocked", label: "Blocked" },
  ];

  useEffect(() => {
    if (isEditMode) {
      const userData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(123) 456-7890",
        role: "Administrator",
        status: "active",
      };
      setFormData({
        ...formData,
        ...userData,
        password: "",
        confirmPassword: "",
      });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!isEditMode && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Form submitted with data:", formData);
    navigate("/users");
  };

  const renderGeneralInfoForm = () => (
    <>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="userName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Name is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="userEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="userPhone">
            <Form.Label>Phone No.</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Phone No."
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="userRole">
            <Form.Label>Role</Form.Label>
            <Form.Select
              required
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="" disabled hidden>
                Select Role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select a role.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
    </>
  );

  const renderPasswordForm = () => (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-3" controlId="userPassword">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              required
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </Button>
            <Form.Control.Feedback type="invalid">
              Password is required.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3" controlId="userConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              required
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <FontAwesomeIcon
                icon={confirmPasswordVisible ? faEyeSlash : faEye}
              />
            </Button>
            <Form.Control.Feedback type="invalid">
              Please confirm the password.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Col>
    </Row>
  );

  return (
    <div className="add-user">
      <PageTitle
        title={isEditMode ? "Edit User" : "Add User"}
        breadcrumbs={[
          { text: "Manage Users", link: "/users" },
          { text: isEditMode ? "Edit User" : "Add User" },
        ]}
      />

      <Card>
        <Card.Header className="d-flex align-items-center justify-content-between">
          <div className="text-xl fw-semibold">
            {isEditMode ? "Edit User" : "Add User"}
          </div>
          <Button
            variant="secondary"
            className="ms-auto"
            onClick={() => navigate("/users")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back
          </Button>
        </Card.Header>

        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {isEditMode ? (
              <Tab.Container defaultActiveKey="general">
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="general" className="border-0">
                      <FontAwesomeIcon icon={faUser} className="me-1" />
                      User Details
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="password" className="border-0">
                      <FontAwesomeIcon icon={faKey} className="me-1" />
                      Change Password
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="general">
                    {renderGeneralInfoForm()}
                  </Tab.Pane>
                  <Tab.Pane eventKey="password">
                    {renderPasswordForm()}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            ) : (
              <>
                {renderGeneralInfoForm()}
                {renderPasswordForm()}
              </>
            )}

            <div className="d-flex gap-2 mt-3">
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSave} className="me-1" />
                {isEditMode ? "Update" : "Save"}
              </Button>
              <Button variant="secondary" onClick={() => navigate("/users")}>
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

export default AddUser;
