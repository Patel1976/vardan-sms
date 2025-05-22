
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrashAlt, 
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import PageTitle from '../../components/PageTitle';
import DataTable from '../../components/DataTable';
import ActionButton from '../../components/ActionButton';

const EmailTemplates = () => {
  const navigate = useNavigate();
  
  // Sample templates
  const [templates, setTemplates] = useState([
    { 
      id: 1, 
      name: 'Welcome Email', 
      subject: 'Welcome to StaffPro!',
      body: '<p>Dear [Name],</p><p>Welcome to StaffPro! We are excited to have you on board.</p><p>Best regards,<br>StaffPro Team</p>'
    },
    { 
      id: 2, 
      name: 'Password Reset', 
      subject: 'Password Reset Request',
      body: '<p>Dear [Name],</p><p>You have requested a password reset. Please click the link below to reset your password:</p><p>[Reset Link]</p><p>Best regards,<br>StaffPro Team</p>'
    },
    { 
      id: 3, 
      name: 'Staff Onboarding', 
      subject: 'Your Onboarding Information',
      body: '<p>Dear [Name],</p><p>Welcome to the team! Here is your onboarding information:</p><ul><li>Login details: [Login]</li><li>Start date: [StartDate]</li><li>Department: [Department]</li></ul><p>Best regards,<br>StaffPro Team</p>'
    },
    { 
      id: 4, 
      name: 'Emergency Notification', 
      subject: 'Emergency Alert',
      body: '<p>Attention!</p><p>An emergency has been reported at [Location]. Please follow safety protocols.</p><p>Details: [Details]</p><p>StaffPro Emergency Team</p>'
    },
    { 
      id: 5, 
      name: 'Weekly Report', 
      subject: 'Weekly Activity Report',
      body: '<p>Dear [Name],</p><p>Here is your weekly activity report:</p><p>[Report Content]</p><p>Best regards,<br>StaffPro Team</p>'
    },
  ]);

  // Delete template handler
  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(template => template.id !== templateId));
    }
  };

  // Table columns configuration
  const columns = [
    { field: 'name', header: 'Template Name' },
    { field: 'subject', header: 'Subject' },
    { 
      field: 'body', 
      header: 'Body',
      render: (value) => (
        <div className="template-body-preview">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: value.length > 70 ? value.substring(0, 70) + '...' : value
            }} 
          />
        </div>
      )
    },
    { 
      field: 'actions', 
      header: 'Actions',
      render: (_, template) => (
        <div className="action-buttons">
          <ActionButton 
            icon={faEdit} 
            variant="outline-primary" 
            onClick={() => navigate(`/email-templates/edit/${template.id}`)} 
            title="Edit Template"
          />
          <ActionButton 
            icon={faTrashAlt} 
            variant="outline-danger" 
            onClick={() => handleDeleteTemplate(template.id)} 
            title="Delete Template"
          />
        </div>
      )
    },
  ];

  return (
    <div className="email-templates">
      <PageTitle 
        title="Email Templates" 
        breadcrumbs={[{ text: 'Settings' }, { text: 'Email Templates' }]} 
      />
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="text-xl fw-semibold">Email Templates</span>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => navigate('/email-templates/add')}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Add Template
          </Button>
        </Card.Header>
        
        <Card.Body>
          <DataTable 
            columns={columns} 
            data={templates} 
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default EmailTemplates;
