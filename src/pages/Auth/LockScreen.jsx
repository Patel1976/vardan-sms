import React, { useState } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";

const LockScreen = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required");
      return;
    }
    const savedPassword = sessionStorage.getItem("password");
    if (password === savedPassword) {
      console.log("Unlocked successfully");
      navigate("/dashboard");
    } else {
      setError("Incorrect password");
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
                  src="/user.jpg"
                  alt="User"
                  className="rounded-circle"
                  style={{ width: "100px", height: "auto", objectFit: "cover" }}
                />
                <p className="text-muted">admin@example.com</p>
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
