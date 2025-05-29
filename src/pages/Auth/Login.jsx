
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { setCookie } from 'nookies';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [redirectNow, setRedirectNow] = useState(false);
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const ValidationSchema = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = ValidationSchema();
    if (!isValid) return;

    try {
      const res = await axios.post(`${API_URL}api/admin/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200 && res.data.success === 1) {
        const { token, userData } = res.data.data;

        setCookie(null, "token", token, {
          maxAge: 60 * 60,
          path: "/",
        });
        localStorage.setItem("email", userData.email);
        sessionStorage.setItem("Role", userData.id);
        setRedirectNow(true);
        login();
      }
    } catch (error) {
      const responseErrors = error.response?.data?.data?.errors;

      if (responseErrors) {
        const newErrors = {};
        if (responseErrors.email) {
          newErrors.email = responseErrors.email[0];
        }
        if (responseErrors.password) {
          newErrors.password = responseErrors.password[0];
        }
        setErrors(newErrors);
      } else if (
        error.response?.data?.message === "Incorrect email or password"
      ) {
        setErrors({
          email: "Incorrect Email!",
          password: "Incorrect Password!",
        });
      } else {
        console.error("Login error:", error);
        setErrors({ general: "Login failed. Please try again later." });
      }
    }
  };

  useEffect(() => {
    if (redirectNow) {
      console.log("Redirecting to /");
      navigate("/dashboard");
    }
  }, [redirectNow]);

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="auth-card mx-auto">
              <div className="auth-logo mb-4 d-flex align-items-center justify-content-center">
                <img
                  src="/public/logo.png"
                  alt="Logo"
                  className="logo-img h-50"
                  width="40%"
                />
              </div>

              <Card.Title className="text-center mb-4 fw-bold">
                <h4>Sign In</h4>
              </Card.Title>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Row className="mb-3">
                    <Col>
                      <Form.Check
                        type="checkbox"
                        name="rememberMe"
                        label="Remember me"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col className="text-end">
                      <Link to="/forget-password">Forgot Password?</Link>
                    </Col>
                  </Row>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} className="me-1" />
                    Sign In
                  </Button>
                </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
