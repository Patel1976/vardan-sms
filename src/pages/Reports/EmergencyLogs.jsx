import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Row, Col, Modal, Image, Spinner } from "react-bootstrap";
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
import axios from "axios";
import { parseCookies } from "nookies";

const EmergencyLogs = () => {
  const navigate = useNavigate();
  const API_URL_STAFF = import.meta.env.VITE_BASE_URL_STAFF;
  const IMAGE_URL = import.meta.env.VITE_IMAGE_UPLOAD_URL;
  const { token } = parseCookies();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        start_date: filterData.fromDate,
        end_date: filterData.toDate,
        token: token,
      };
      const response = await axios.post(`${API_URL_STAFF}get-all-emergency-log`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const rawLogs = response.data.images?.data || [];
      const formattedLogs = rawLogs.map(log => ({
        id: log.id,
        date: new Date(log.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: new Date(log.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        staffName: log.staff_name,
        description: log.description,
        image: log.image || "",
      }));
      setLogs(formattedLogs);
    }
    catch (err) {
      console.error("Failed to fetch all logs", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchStaffLogs = async (staffId) => {
    try {
      setLoading(true);
      const requestData = {
        start_date: filterData.fromDate,
        end_date: filterData.toDate,
        token: token,
      };
      const response = await axios.post(
        `${API_URL_STAFF}get-emergency-log/${staffId}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rawLogs = response.data.images?.data || [];
      const formattedLogs = rawLogs.map(log => ({
        id: log.id,
        date: new Date(log.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: new Date(log.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        staffName: log.staff_name,
        description: log.description,
        image: log.image || "",
      }));
      setLogs(formattedLogs);
    } catch (err) {
      console.error("Failed to fetch staff logs", err);
    } finally {
      setLoading(false);
    }
  };

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
      render: (_, row) => {
        const image = row.image;
        return (
          <div>
            {image && image.length > 0 ? (
              <img
                src={`${IMAGE_URL}${image}`}
                alt="Emergency log thumbnail"
                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
              />
            ) : (
              <span className="badge bg-light text-dark">No image</span>
            )}
          </div>
        );
      }
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
              <Col md={4}>
                <Form.Group className="mb-3" controlId="staffId">
                  <Form.Label>Staff Members</Form.Label>
                  <SearchStaff
                    onSelectedOptionsChange={handleStaffSelect}
                    token={token}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3" controlId="fromDate">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="fromDate"
                    value={filterData.fromDate}
                    onChange={handleFilterChange}
                    max={filterData.toDate}
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
                    min={filterData.fromDate}
                  />
                </Form.Group>
              </Col>

              <Col
                md={2}
                className="d-flex align-items-end mb-3 reports-btn-filter"
              >
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
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <DataTable columns={columns} data={logs} showSearch={false} />
          )}
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
              <div className="mb-4">
                <h5>Description:</h5>
                <p className="emergency-description">
                  {selectedLog.description}
                </p>
              </div>
              <div>
                <h5>Image:</h5>
                {selectedLog.image && (
                  <img
                    src={`${IMAGE_URL}${selectedLog.image}`}
                    alt="Emergency"
                    className="emergency-image"
                    style={{ maxHeight: '300px' }}
                  />
                )}
              </div>
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
