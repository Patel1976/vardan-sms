import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faArrowLeft,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/PageTitle";
import axios from "axios";
import { parseCookies } from "nookies";

const AddStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL_STAFF = import.meta.env.VITE_BASE_URL_STAFF;
  const IMAGE_URL = import.meta.env.VITE_IMAGE_UPLOAD_URL;
  const isEditMode = !!id;
  const { token } = parseCookies();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mpin: "",
    address: "",
    status: true,
    department: "",
    profileImageFile: null,
    profileImagePreview: "",
  });

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      // Fetch staff data for editing
      const fetchStaffData = async () => {
        try {
          const response = await axios.get(
            `${API_URL_STAFF}get-staff-user/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const staffData = response.data.data;
          setFormData((prev) => ({
            ...prev,
            name: staffData.name || "",
            email: staffData.email || "",
            phone: staffData.phone || "",
            mpin: staffData.mpin || "",
            address: staffData.address || "",
            status: staffData.status ?? true,
            department: staffData.department || "",
            profileImagePreview: staffData.image
              ? `${IMAGE_URL}${staffData.image}`
              : "",
          }));
        } catch (error) {
          console.error("Error fetching staff data:", error);
          alert("Failed to load user data.");
        }
      };
      fetchStaffData();
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImageFile: file,
        profileImagePreview: URL.createObjectURL(file),
      }));

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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email || "");
    payload.append("phone", formData.phone);
    payload.append("mpin", formData.mpin || "");
    payload.append("address", formData.address);
    payload.append("status", formData.status ? 1 : 0);
    payload.append("department", formData.department || "");
    if (formData.profileImageFile) {
      payload.append("image", formData.profileImageFile);
    }
    const submitForm = async () => {
      try {
        if (isEditMode) {
          await axios.post(
            `${API_URL_STAFF}update-staff-user/${id}?_method=PUT`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          alert("Staff updated successfully");
        } else {
          await axios.post(`${API_URL_STAFF}create-staff-user`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          alert("Staff added successfully");
        }
        navigate("/staff");
      } catch (err) {
        const msg = err.response?.data?.message || "Error saving staff";
        alert(msg);
      }
    };
    submitForm();
  };

  return (
    <div className="add-staff">
      <PageTitle
        title={isEditMode ? "Edit Staff" : "Add Staff"}
        breadcrumbs={[
          { text: "Manage Staff", link: "/staff" },
          { text: isEditMode ? "Edit Staff" : "Add Staff" },
        ]}
      />

      <Card>
        <Card.Header className="d-flex align-items-center justify-content-between">
          <div className="text-xl fw-semibold">
            {isEditMode ? "Edit Staff" : "Add Staff"}
          </div>
          <Button
            variant="secondary"
            className="ms-auto"
            onClick={() => navigate("/staff")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back
          </Button>
        </Card.Header>

        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={12} className="mb-4 text-center">
                <div
                  onClick={() => document.getElementById("profileImage").click()}
                  className="upload-profile"
                >
                  {formData.profileImagePreview ? (
                    <Image
                      src={formData.profileImagePreview}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="upload-placeholder">
                      <FontAwesomeIcon
                        icon={faUpload}
                        size="2x"
                        color="#bd9a68"
                      />
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
              <Col md={12}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="staffName">
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
                    <Form.Group className="mb-3" controlId="staffEmail">
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
                    <Form.Group className="mb-3" controlId="staffPhone">
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
                    <Form.Group className="mb-3" controlId="staffDepartment">
                      <Form.Label>Department</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3" controlId="staffAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter street address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex gap-2 mt-4">
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSave} className="me-1" />
                {isEditMode ? "Update" : "Save"}
              </Button>

              <Button variant="secondary" onClick={() => navigate("/staff")}>
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

export default AddStaff;
