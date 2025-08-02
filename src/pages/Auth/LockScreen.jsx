import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { setCookie } from "nookies";
import axios from "axios";
import { useUser } from '../../context/UserContext';

const LockScreen = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const IMAGE_URL = import.meta.env.VITE_IMAGE_UPLOAD_URL;
  const { setUser } = useUser();

  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const savedEmail = user?.email;
    if (!savedEmail) {
      console.log('Email Not found')
    } else {
      setEmail(savedEmail);
    }
  }, []);
  const userImage = user?.image
    ? `${IMAGE_URL}${user.image}`
    : '/placeholder.png';

  const validateForm = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setError(newErrors.password || "");
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    try {
      const res = await axios.post(`${API_URL}api/admin/auth/login`, {
        email: email,
        password: password,
      });

      if (res.status === 200 && res.data.success === 1) {
        const { token, userData } = res.data.data;
        setCookie(null, "token", token, {
          maxAge: 30 * 60,
          path: "/",
        });
        const userInfo = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          image: userData.image
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
        const redirectPath = localStorage.getItem("redirect_after_unlock") || "/dashboard";
        localStorage.removeItem("redirect_after_unlock");
        navigate(redirectPath);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Login failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="auth-card mx-auto text-center p-5">
              <Card.Title className="text-center mb-4">
                <h4>Lock Screen</h4>
              </Card.Title>
              <div className="lock-screen mb-4 d-flex align-items-center">
                <img
                  src={userImage}
                  alt="User"
                  className="rounded-circle"
                  style={{ width: "100px", height: "auto", objectFit: "cover" }}
                />
                <p className="text-muted"> {email} </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 text-start">
                  <Form.Label className="">Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter Password"
                      isInvalid={!!error}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  <FontAwesomeIcon icon={faUnlock} className="me-1" />
                  Unlock
                </Button>

                <div className="text-center d-flex justify-content-center align-items-center">
                  <p>Login with Different Account</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/login")}
                    className="p-1"
                  >
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

export default LockScreen;
