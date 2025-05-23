import React, { useState } from "react";
import { Card, Row, Col, Form, Button, Tab, Nav, Image } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faKey,
  faEnvelope,
  faUser,
  faCamera,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/PageTitle";

const MyProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "Admin",
    email: "admin@example.com",
    phone: "+1 (123) 456-7890",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profileImageUrl: "",
  });

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, profileImageUrl: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would handle the profile update here
    console.log("Form submitted:", formData);
    alert("Profile updated successfully!");
  };

  return (
    <div className="my-profile">
      <PageTitle title="My Profile" breadcrumbs={[{ text: "My Profile" }]} />

      <Row>
        <Col lg={2} className="mb-4 d-flex align-items-center">
          <div
            onClick={() => document.getElementById("profileImage").click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleImageChange({ target: { files: [file] } });
            }}
            className="upload-profile"
          >
            {formData.profileImageUrl ? (
              <Image
                src={formData.profileImageUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div className="upload-placeholder">
                <FontAwesomeIcon icon={faUpload} size="2x" color="#bd9a68" />
                <div className="upload-label">Upload Photo</div>
              </div>
            )}

            <div className="upload-hover"></div>
          </div>

          <Form.Control
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </Col>

        <Col lg={10}>
          <Card>
            <Card.Body>
              <Tab.Container defaultActiveKey="general">
                <Nav variant="tabs" className="border-0">
                  <Nav.Item>
                    <Nav.Link eventKey="general" className="border-0">
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

                <Tab.Content className="p-4 border rounded-3">
                  <Tab.Pane eventKey="general">
                    <Form onSubmit={handleSubmit} className="">
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone No.</Form.Label>
                            <Form.Control
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button variant="primary" type="submit">
                        <FontAwesomeIcon icon={faSave} className="me-1" />
                        Save
                      </Button>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="password">
                    <Form onSubmit={handleSubmit} className="">
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Button variant="primary" type="submit">
                        <FontAwesomeIcon icon={faKey} className="me-1" />
                        Update
                      </Button>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyProfile;
