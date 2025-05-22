import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Button, Row, Col, Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faArrowLeft,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PageTitle from "../../components/PageTitle";

const AddEmailTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
  });

  const [validated, setValidated] = useState(false);

  // Sample placeholders for email templates
  const placeholders = [
    { key: "[Name]", description: "Full name of the recipient" },
    { key: "[Email]", description: "Email address of the recipient" },
    { key: "[Department]", description: "Department of the staff member" },
    { key: "[Position]", description: "Job position of the staff member" },
    { key: "[StartDate]", description: "Start date of employment" },
    { key: "[Location]", description: "Location or address" },
    { key: "[LoginUrl]", description: "URL for system login" },
    { key: "[ResetLink]", description: "Password reset link" },
    { key: "[Details]", description: "Additional details or information" },
    { key: "[Date]", description: "Current date" },
  ];

  // Quill editor modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Quill editor formats
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "align",
    "link",
    "image",
  ];

  // If in edit mode, load template data
  useEffect(() => {
    if (isEditMode) {
      // In a real app, fetch template data from API using ID
      // For demo, we're using mock data
      const templateData = {
        name: "Welcome Email",
        subject: "Welcome to StaffPro!",
        body: "<p>Dear [Name],</p><p>Welcome to StaffPro! We are excited to have you on board.</p><p>Best regards,<br>StaffPro Team</p>",
      };

      setFormData(templateData);
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle quill editor content change
  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      body: content,
    });
  };

  // Insert placeholder into subject or body at cursor position
  const insertPlaceholder = (placeholder, field) => {
    if (field === "subject") {
      setFormData({
        ...formData,
        subject: formData.subject + placeholder,
      });
    } else if (field === "body") {
      // For body, we simply append it since we don't have direct cursor control with ReactQuill
      setFormData({
        ...formData,
        body: formData.body + placeholder,
      });
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

    // Redirect back to templates list
    navigate("/email-templates");
  };

  return (
    <div className="add-email-template">
      <PageTitle
        title={isEditMode ? "Edit Email Template" : "Add Email Template"}
        breadcrumbs={[
          { text: "Settings", link: "/email-templates" },
          { text: isEditMode ? "Edit Template" : "Add Template" },
        ]}
      />

      <Card>
        <Card.Header className="d-flex align-items-center justify-content-between">
          <div className="text-xl fw-semibold">
            {isEditMode ? "Edit Email Template" : "Add New Email Template"}
          </div>
          <Button
            variant="secondary"
            className="ms-auto"
            onClick={() => navigate("/email-templates")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back
          </Button>
        </Card.Header>

        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3" controlId="templateName">
                  <Form.Label>Template Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter template name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Template name is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3" controlId="templateSubject">
                  <Form.Label>Email Subject</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter email subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Email subject is required.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="templateBody">
              <Form.Label>Email Body</Form.Label>
              <ReactQuill
                value={formData.body}
                onChange={handleEditorChange}
                modules={quillModules}
                formats={quillFormats}
                className="quill-editor"
                style={{ height: "300px", marginBottom: "50px" }}
              />
              {!formData.body && (
                <Form.Text className="text-danger">
                  Email body is required.
                </Form.Text>
              )}
            </Form.Group>

            <Accordion className="mb-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  Available Placeholders
                </Accordion.Header>
                <Accordion.Body>
                  <p className="mb-2">
                    Click on any placeholder to insert it into the subject or
                    email body:
                  </p>

                  <Row>
                    <Col md={6}>
                      <div className="mb-2">
                        <strong>For Subject:</strong>
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {placeholders.map((placeholder, index) => (
                          <Button
                            key={index}
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              insertPlaceholder(placeholder.key, "subject")
                            }
                          >
                            {placeholder.key}
                          </Button>
                        ))}
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-2">
                        <strong>For Body:</strong>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {placeholders.map((placeholder, index) => (
                          <Button
                            key={index}
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              insertPlaceholder(placeholder.key, "body")
                            }
                          >
                            {placeholder.key}
                          </Button>
                        ))}
                      </div>
                    </Col>
                  </Row>

                  <hr />

                  <h6>Placeholder Reference:</h6>
                  <Row>
                    {placeholders.map((placeholder, index) => (
                      <Col md={6} key={index} className="mb-2">
                        <strong>{placeholder.key}</strong>:{" "}
                        {placeholder.description}
                      </Col>
                    ))}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <div className="d-flex gap-2 mt-4">
              <Button variant="primary" type="submit" disabled={!formData.body}>
                <FontAwesomeIcon icon={faSave} className="me-1" />
                {isEditMode ? "Update Template" : "Save Template"}
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate("/email-templates")}
              >
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

export default AddEmailTemplate;
