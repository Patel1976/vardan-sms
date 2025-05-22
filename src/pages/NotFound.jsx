
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Col md={8} className="text-center">
          <h1 className="display-1 fw-bold">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-5">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <Button 
            as={Link} 
            to="/" 
            variant="primary" 
            size="lg"
            className="px-4"
          >
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Back to Dashboard
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
