import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusBadge = ({ status, customStatusMap }) => {
  const defaultStatusMap = {
    active: { bg: 'success', text: 'Active' },
    inactive: { bg: 'secondary', text: 'Inactive' },
    pending: { bg: 'warning', text: 'Pending' },
    blocked: { bg: 'danger', text: 'Blocked' },
    approved: { bg: 'success', text: 'Approved' },
    rejected: { bg: 'danger', text: 'Rejected' },
    completed: { bg: 'success', text: 'Completed' },
    inProgress: { bg: 'primary', text: 'In Progress' },
  };

  const statusKey = typeof status === 'boolean'
    ? status ? 'active' : 'inactive'
    : String(status).toLowerCase();

  const statusMap = { ...defaultStatusMap, ...customStatusMap };
  const statusConfig = statusMap[statusKey] || {
    bg: 'info',
    text: statusKey.charAt(0).toUpperCase() + statusKey.slice(1)
  };

  return (
    <Badge bg={statusConfig.bg} className="status-badge">
      {statusConfig.text}
    </Badge>
  );
};

export default StatusBadge;