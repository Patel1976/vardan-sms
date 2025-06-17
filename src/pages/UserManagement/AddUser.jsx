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
import axios from "axios";
import { parseCookies } from "nookies";

const AddUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASE_URL;
  const isEditMode = !!id;
  const { token } = parseCookies();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      axios
        .post(
          `${API_URL}get-user-by-id/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const user = response.data.data;
          setFormData((prevData) => ({
            ...prevData,
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            status: user.status || "active",
            password: "",
            confirmPassword: "",
          }));
        })
        .catch((error) => {
          console.error("Error loading user:", error);
          alert("Failed to load user data.");
        });
    }
  }, [id, isEditMode, API_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
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

    const userPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      ...(isEditMode ? {} : { password: formData.password }),
    };

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}update-user/${id}`, userPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("User updated successfully");
      } else {
        await axios.post(`${API_URL}create-user`, userPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("User created successfully");
      }
      navigate("/users");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to save user. Please try again.";
      alert(msg);
    }
  };

  return (
    <div className="add-user">
      <PageTitle
        title={isEditMode ? "Edit User" : "Add User"}
        breadcrumbs={[{ text: isEditMode ? "Edit User" : "Add User" }]}
      />

      <Card>
        <Card.Header className="d-flex align-items-center justify-content-between">
          <div className="text-xl fw-semibold">
            {isEditMode ? "Edit User" : "Add New User"}
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
            {!isEditMode ? (
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
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="userPassword">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          required
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Enter password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setPasswordVisible((prev) => !prev)}
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
                          placeholder="Confirm password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setConfirmPasswordVisible((prev) => !prev)}
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
              </>
            ) : (
              <Tab.Container defaultActiveKey="details">
                <Nav variant="tabs" className="border-0">
                  <Nav.Item>
                    <Nav.Link eventKey="details" className="border-0">
                      <FontAwesomeIcon icon={faUser} className="me-1" />
                      General Info
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="password" className="border-0">
                      <FontAwesomeIcon icon={faKey} className="me-1" />
                      Change Password
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content className="">
                  <Tab.Pane eventKey="details">
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
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter phone number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="password">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="userPassword">
                          <Form.Label>New Password</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={passwordVisible ? "text" : "password"}
                              placeholder="Enter new password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => setPasswordVisible((prev) => !prev)}
                            >
                              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                            </Button>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="userConfirmPassword">
                          <Form.Label>Confirm Password</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={confirmPasswordVisible ? "text" : "password"}
                              placeholder="Confirm new password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                            >
                              <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} />
                            </Button>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
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
      </Card >
    </div >
  );
};

export default AddUser;
