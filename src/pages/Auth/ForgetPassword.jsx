import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await axios.post(`${API_URL}auth/send-forget-password-email`, { email });
      if (res.status === 200 && res.data.success === 1) {
        alert('Reset link sent to your email.');
      } else {
        alert(res.data.message || 'Failed to send reset link.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset link.';
      setError(msg);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="auth-card mx-auto text-center p-5">
              <Card.Title className="mb-4">
                <h4>Forgot Password</h4>
              </Card.Title>

              <p className="text-muted mb-4">
                Enter your email and we will send you a link to reset your password.
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Send Reset Link
                </Button>

                <div className="text-center">
                  <span>Back to Sign In? </span>
                  <Button variant="link" onClick={() => navigate("/login")} className="p-0">
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;