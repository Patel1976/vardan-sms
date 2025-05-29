import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
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
    profileImageBase64: "",
    profileImageFile: null,
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
          setFormData({
            name: staffData.name || "",
            email: staffData.email || "",
            phone: staffData.phone || "",
            mpin: staffData.mpin || "",
            address: staffData.address || "",
            status: staffData.status ?? true,
            department: staffData.department || "",
            profileImageBase64: staffData.image || "",
            profileImageFile: null,
          });
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

    const payload = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone,
      mpin: formData.mpin || null,
      address: formData.address,
      status: formData.status,
      department: formData.department || null,
      ...(formData.profileImageBase64 && { image: formData.profileImageBase64 }),
    };
    const submitForm = async () => {
      try {
        if (isEditMode) {
          axios.put(`${API_URL_STAFF}update-staff-user/${id}`, payload, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          alert("Staff updated successfully");
        }
        else {
          axios.post(`${API_URL_STAFF}create-staff-user`, payload, {
            headers: {
              Authorization: `Bearer ${token}`
            }
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
                  onClick={() =>
                    document.getElementById("profileImage").click()
                  }
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleImageChange({ target: { files: [file] } });
                  }}
                  className="upload-profile"
                >
                  {formData.profileImageBase64 ? (
                    <Image
                      src={`data:image/jpeg;base64,${formData.profileImageBase64}`}
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

            <h5 className="mt-3 mb-3">Employment Information</h5>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="staffDepartment">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                  </Form.Control>
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
    </div >
  );
};

export default AddStaff;
