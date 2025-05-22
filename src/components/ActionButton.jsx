
import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ActionButton = ({ 
  icon, 
  label, 
  variant = 'primary',
  size = 'sm',
  onClick,
  className = '',
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`d-inline-flex align-items-center ${className}`}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} className={label ? 'me-1' : ''} />}
      {label}
    </Button>
  );
};

export default ActionButton;
