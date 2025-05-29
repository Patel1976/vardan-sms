import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Row, Col, Modal, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faDownload,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/PageTitle";
import DataTable from "../../components/DataTable";
import ActionButton from "../../components/ActionButton";
import SearchStaff from "../../components/searchStaff";
import axios from 'axios';
import { parseCookies } from 'nookies';

const EmergencyLogs = () => {
  const navigate = useNavigate();
  const API_URL_STAFF = import.meta.env.VITE_BASE_URL_STAFF;
  const { token } = parseCookies();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [filterData, setFilterData] = useState({
    fromDate: "",
    toDate: "",
  });
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const requestData = {
        fromDate: filterData.fromDate,
        toDate: filterData.toDate,
        token: token,
      };
      const response = await axios.post(`${API_URL_STAFF}get-all-emergency-log`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(response.data.logs || []);
    }
    catch (err) {
      console.error("Failed to fetch all logs", err);
    } finally {
      setLoading(false);
    }
  }
  const fetchStaffLogs = async (staffId) => {
    try {
      const requestData = {
        fromDate: filterData.fromDate,
        toDate: filterData.toDate,
        token: token,
      };
      const response = await axios.post(`${API_URL_STAFF}get-emergency-log/${staffId}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(response.data.logs || []);
    }
    catch (err) {
      console.error("Failed to fetch staff logs", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData({
      ...filterData,
      [name]: value,
    });
  };

  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (selectedStaff?.value) {
      fetchStaffLogs(selectedStaff.value);
    } else {
      fetchLogs();
    }
  };

  // Handle view log details
  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowLogModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowLogModal(false);
    setSelectedLog(null);
  };

  // Table columns configuration
  const columns = [
    { field: "date", header: "Date" },
    { field: "time", header: "Time" },
    { field: "staffName", header: "Staff" },
    { field: "description", header: "Description" },
    {
      field: "images",
      header: "Images",
      render: (images) => (
        <div>
          {images.length > 0 ? (
            <span className="badge bg-info">
              {images.length} image{images.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="badge bg-light text-dark">No images</span>
          )}
        </div>
      ),
    },
    {
      field: "actions",
      header: "Actions",
      render: (_, log) => (
        <div className="action-buttons">
          <ActionButton
            icon={faEye}
            variant="outline-info"
            onClick={() => handleViewLog(log)}
            title="View Details"
          />
          <ActionButton
            icon={faDownload}
            variant="outline-success"
            onClick={() => console.log("Download log:", log.id)}
            title="Download Report"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="emergency-logs">
      <PageTitle
        title="Emergency Logs"
        breadcrumbs={[{ text: "Emergency Logs" }]}
      />

      <Card className="mb-4">
        <Card.Header className="text-xl fw-semibold">
          <FontAwesomeIcon icon={faSearch} className="me-2" />
          Filter Emergency Logs
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3" controlId="fromDate">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="fromDate"
                    value={filterData.fromDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3" controlId="toDate">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="toDate"
                    value={filterData.toDate}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3" controlId="staffId">
                  <Form.Label>Staff Members</Form.Label>
                  <SearchStaff
                    onSelectedOptionsChange={handleStaffSelect}
                    token={token}
                  />
                </Form.Group>
              </Col>

              <Col md={2} className="d-flex align-items-end mb-3">
                <Button variant="primary" type="submit" className="w-100">
                  <FontAwesomeIcon icon={faSearch} className="me-1" />
                  Filter
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="text-xl fw-semibold">
          Emergency Logs List
        </Card.Header>
        <Card.Body>
          <DataTable columns={columns} data={logs} showSearch={false} />
        </Card.Body>
      </Card>

      {/* Emergency Log Details Modal - Simplified to only show description and image */}
      <Modal show={showLogModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Emergency Log Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedLog && (
            <div className="emergency-details">
              {/* Only show description and large image(s) */}
              <div className="mb-4">
                <h5>Description:</h5>
                <p className="emergency-description">
                  {selectedLog.description}
                </p>
              </div>

              {selectedLog.images.length > 0 && (
                <div>
                  <h5 className="mb-3">Images:</h5>
                  {selectedLog.images.map((img, index) => (
                    <div key={index} className="mb-3">
                      <Image
                        src={img}
                        alt={`Emergency ${index + 1}`}
                        className="emergency-image"
                        fluid
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmergencyLogs;
