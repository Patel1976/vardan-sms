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
import axios from 'axios';
import { parseCookies } from "nookies";

const AddEmailTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL_EMAIL_TEMPLATES = import.meta.env.VITE_BASE_URL;
  const isEditMode = !!id;
  const { token } = parseCookies();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
  });

  const [validated, setValidated] = useState(false);

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

  useEffect(() => {
    if (isEditMode) {
      // Fetch template data for editing
      const fetchTemplateData = async () => {
        try {
          const response = await axios.post(`${API_URL_EMAIL_TEMPLATES}get-email-template/${id}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const templateData = response.data.data;
          setFormData({
            name: templateData.name || "",
            subject: templateData.subject || "",
            body: templateData.body || "",
          });
        } catch (error) {
          const errorMessage = error.response?.data?.message || "An error occurred while fetching template data.";
          alert(errorMessage);
        }
      };
      fetchTemplateData();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      body: content,
    });
  };

  const insertPlaceholder = (placeholder, field) => {
    if (field === "subject") {
      setFormData({
        ...formData,
        subject: formData.subject + placeholder,
      });
    } else if (field === "body") {
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
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const payload = {
      id: id,
      name: formData.name,
      subject: formData.subject,
      body: formData.body,
    };
    const submitForm = async () => {
      try {
        if (isEditMode) {
          await axios.put(`${API_URL_EMAIL_TEMPLATES}update-email-template`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          await axios.post(`${API_URL_EMAIL_TEMPLATES}create-email-template`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        navigate("/email-template");
      } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred while submitting the form.";
        alert(errorMessage);
      }
    }
    submitForm();
  };

  return (
    <div className="add-email-template">
      <PageTitle
        title={isEditMode ? "Edit Email Template" : "Add Email Template"}
        breadcrumbs={[
          { text: "Email Templates", link: "/email-templates" },
          { text: isEditMode ? "Edit Email Template" : "Add Email Template" },
        ]}
      />

      <Card>
        <Card.Header className="d-flex align-items-center justify-content-between">
          <div className="text-xl fw-semibold">
            {isEditMode ? "Edit Email Template" : "Add Email Template"}
          </div>
          <Button
            variant="secondary"
            className="ms-auto"
            onClick={() => navigate("/email-template")}
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
                    placeholder="Enter Template Name"
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
                      placeholder="Enter Email Subject"
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
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSave} className="me-1" />
                {isEditMode ? "Update" : "Save"}
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate("/email-template")}
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
