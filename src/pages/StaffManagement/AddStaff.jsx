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

const AddStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    department: "",
    position: "",
    hireDate: "",
    status: "active",
    profileImage: null,
    profileImageUrl: "",
  });

  const [validated, setValidated] = useState(false);

  // Sample departments for dropdown
  const departments = [
    { id: 1, name: "Marketing" },
    { id: 2, name: "HR" },
    { id: 3, name: "Sales" },
    { id: 4, name: "Development" },
    { id: 5, name: "Finance" },
  ];

  // Sample positions for dropdown
  const positions = [
    { id: 1, name: "Manager" },
    { id: 2, name: "Team Lead" },
    { id: 3, name: "Senior Staff" },
    { id: 4, name: "Junior Staff" },
    { id: 5, name: "Intern" },
  ];

  // If in edit mode, load staff data
  useEffect(() => {
    if (isEditMode) {
      // In a real app, fetch staff data from API using ID
      // For demo, we're using mock data
      const staffData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(123) 456-7890",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        department: "Marketing",
        position: "Manager",
        hireDate: "2023-01-15",
        status: "active",
        profileImageUrl: "https://via.placeholder.com/150",
      };

      setFormData(staffData);
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

    // Redirect back to staff list
    navigate("/staff");
  };

  return (
    <div className="add-staff">
      <PageTitle
        title={isEditMode ? "Edit Staff" : "Add Staff"}
        breadcrumbs={[
          { text: "Staff Management", link: "/staff" },
          { text: isEditMode ? "Edit Staff" : "Add Staff" },
        ]}
      />

      <Card>
        <Card.Header className="d-flex align-items-center justify-content-between">
          <div className="text-xl fw-semibold">
            {isEditMode ? "Edit Staff Member" : "Add New Staff Member"}
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
              <Col md={3} className="mb-4 text-center">
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

              <Col md={9}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="staffName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Enter staff name"
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
                        placeholder="Enter email address"
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

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="staffHireDate">
                      <Form.Label>Hire Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="hireDate"
                        value={formData.hireDate}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* <h5 className="mt-3 mb-3">
              <b>Address Information</b>
            </h5> */}

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

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="staffCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3" controlId="staffState">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3" controlId="staffZipCode">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter zip code"
                    name="zipCode"
                    value={formData.zipCode}
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
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="staffPosition">
                  <Form.Label>Position</Form.Label>
                  <Form.Select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Position</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.name}>
                        {pos.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {isEditMode && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="staffStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <div className="d-flex gap-2 mt-4">
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSave} className="me-1" />
                {isEditMode ? "Update Staff" : "Save Staff"}
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
