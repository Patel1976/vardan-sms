import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button, Tab, Nav, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
import axios from "axios";
import { parseCookies } from "nookies";
import { User } from "lucide-react";
import { useUser } from '../../context/UserContext';

const MyProfile = () => {
  const navigate = useNavigate();
  const API_URL_STAFF = import.meta.env.VITE_BASE_URL;
  const { token } = parseCookies();
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({});
  console.log('Phone', user);
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        firstName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImageBase64: user.image || "",
        profileImageFile: null,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImageFile: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          profileImageBase64: event.target.result.split(",")[1],
        }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.firstName,
        email: formData.email,
        phone: formData.phone,
        ...(formData.profileImageBase64 && { image: formData.profileImageBase64 }),
      };
      const res = await axios.put(
        `${API_URL_STAFF}edit-profile/${formData.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200 && res.data.success === 1) {
        alert("Profile updated successfully!");
        setUser((prevUser) => ({
          ...prevUser,
          name: formData.firstName,
          email: formData.email,
          phone: formData.phone,
          image: formData.profileImageBase64 || prevUser.image,
        }));
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const payload = {
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      };

      const res = await axios.put(
        `${API_URL_STAFF}user/change-password/${formData.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 && res.data.success === 1) {
        alert("Password updated successfully!");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        alert(res.data?.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.response?.data?.data?.errors) {
        const messages = Object.values(error.response.data.data.errors)
          .flat()
          .join("\n");
        alert(messages);
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred while updating your password.");
      }
    }
  };

  return (
    <div className="my-profile">
      <PageTitle title="My Profile" breadcrumbs={[{ text: "My Profile" }]} />

      <Row>
        <Col lg={3} md={4} className="mb-4 d-flex align-items-center">
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
            {formData.profileImageBase64 || formData.profileImageUrl ? (
              <Image
                src={
                  formData.profileImageBase64
                    ? `data:image/jpeg;base64,${formData.profileImageBase64}`
                    : formData.profileImageUrl
                }
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

        <Col lg={9} md={8}>
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
                    <Form onSubmit={handlePasswordSubmit} className="">
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
