
import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusBadge = ({ status, customStatusMap }) => {
  // Default status mapping
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

  // Merge custom status map with default
  const statusMap = {...defaultStatusMap, ...customStatusMap};
  
  // Get status config or use generic fallback
  const statusConfig = statusMap[status] || { 
    bg: 'info', 
    text: status.charAt(0).toUpperCase() + status.slice(1) 
  };
  
  return (
    <Badge 
      bg={statusConfig.bg}
      className="status-badge"
    >
      {statusConfig.text}
    </Badge>
  );
};

export default StatusBadge;
