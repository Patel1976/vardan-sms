import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/PageTitle";
import DataTable from "../../components/DataTable";
import ActionButton from "../../components/ActionButton";
import axios from 'axios';
import { parseCookies } from "nookies";

const EmailTemplates = () => {
  const navigate = useNavigate();
  const API_URL_EMAIL_TEMPLATES = import.meta.env.VITE_BASE_URL;
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = parseCookies();

  // Delete template handler
  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      const response = await axios.delete(`${API_URL_EMAIL_TEMPLATES}delete-email-template`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id: templateId },
      });
      if (response.status === 200 && response.data.success === 1) {
        alert("Template deleted successfully");
        setTemplates(templates.filter(template => template.id !== templateId));
      } else {
        alert(response.data.message || "Failed to delete template");
      }
    }
    catch (err) {
      const msg = err.response?.data?.message || "Error deleting template";
      alert(msg);
    };
  };

  // Table columns configuration
  const columns = [
    { field: "name", header: "Template Name" },
    { field: "subject", header: "Subject" },
    {
      field: "body",
      header: "Body",
      render: (value) => (
        <div className="template-body-preview">
          <div
            dangerouslySetInnerHTML={{
              __html:
                value.length > 70 ? value.substring(0, 70) + "..." : value,
            }}
          />
        </div>
      ),
    },
    {
      field: "actions",
      header: "Actions",
      render: (_, template) => (
        <div className="action-buttons">
          <ActionButton
            icon={faEdit}
            variant="outline-primary"
            onClick={() => navigate(`/email-template/edit/${template.id}`)}
            title="Edit Template"
          />
          <ActionButton
            icon={faTrashAlt}
            variant="outline-danger"
            onClick={() => handleDeleteTemplate(template.id)}
            title="Delete Template"
          />
        </div>
      ),
    },
  ];
  // Fetch email templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.post(`${API_URL_EMAIL_TEMPLATES}get-all-email-templates`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setTemplates(response.data.data);
        } else {
          setError("Failed to fetch email templates");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching email templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="email-templates">
      <PageTitle
        title="Email Templates"
        breadcrumbs={[{ text: "Email Templates" }]}
      />

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="text-xl fw-semibold">Email Templates</span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/email-template/add')}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Add Template
          </Button>
        </Card.Header>

        <Card.Body>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <DataTable columns={columns} data={templates} />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default EmailTemplates;
