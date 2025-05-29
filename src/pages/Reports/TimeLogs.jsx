import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Badge, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileExport, faClock } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import DataTable from "../../components/DataTable";
import SearchStaff from "../../components/searchStaff";
import axios from "axios";
import { parseCookies } from "nookies";

const TimeLogs = () => {
  const navigate = useNavigate();
  const TIME_LOG_API = import.meta.env.VITE_BASE_URL_STAFF;
  const { token } = parseCookies();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [filterData, setFilterData] = useState({
    fromDate: "",
    toDate: "",
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const staffIdFromUrl = queryParams.get("staffId");

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
  };

  const fetchAllLogs = async () => {
    try {
      setLoading(true);
      const requestData = {
        fromDate: filterData.fromDate,
        toDate: filterData.toDate,
        token: token,
      };
      const res = await axios.post(`${TIME_LOG_API}get-all-time-log`, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data.logs || []);
    } catch (error) {
      console.error("Failed to fetch all logs", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffLogs = async (staffId) => {
    try {
      setLoading(true);
      const requestData = {
        fromDate: filterData.fromDate,
        toDate: filterData.toDate,
        token: token,
      };
      const res = await axios.post(`${TIME_LOG_API}get-time-log/${staffId}`, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data.logs || []);
    } catch (error) {
      console.error("Failed to fetch staff logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffIdFromUrl) {
      fetchStaffLogs(staffIdFromUrl);
    } else {
      fetchAllLogs();
    }
  }, [staffIdFromUrl]);

  const handleFilterChange = (e) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (selectedStaff?.value) {
      fetchStaffLogs(selectedStaff.value);
    } else {
      fetchAllLogs();
    }
  };

  const handleExportLogs = async () => {
    try {
      const res = await axios.get(`${TIME_LOG_API}/logs/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
        params: {
          id: staffId,
          ...filterData,
        },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "time_logs.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  // --- Table columns & actions ---
  const columns = [
    { field: "date", header: "Date" },
    { field: "staff_name", header: "Staff Name" },
    { field: "check_in", header: "Check In" },
    { field: "check_out", header: "Check Out" },
    { field: "total_hours", header: "Total Hours" },
    { field: "work_location", header: "Location" },
  ];

  const tableActions = (
    <Button variant="outline-secondary" size="sm" onClick={handleExportLogs}>
      <FontAwesomeIcon icon={faFileExport} className="me-1" />
      Export Logs
    </Button>
  );

  return (
    <div className="time-logs">
      <PageTitle title="Time Logs" breadcrumbs={[{ text: "Time Logs" }]} />

      <Card className="mb-4">
        <Card.Header className="text-xl fw-semibold">
          <FontAwesomeIcon icon={faSearch} className="me-2" />
          Filter Time Logs
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group controlId="fromDate" className="mb-3">
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
                <Form.Group controlId="toDate" className="mb-3">
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
                <Form.Group controlId="staffId" className="mb-3">
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
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="text-xl fw-semibold">
            <FontAwesomeIcon icon={faClock} className="me-2" />
            Time Logs
            {selectedStaff?.label && (
              <Badge bg="info" className="ms-2">
                Filtered by Staff: {selectedStaff.label}
              </Badge>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <DataTable
              columns={columns}
              data={logs}
              actions={tableActions}
              showSearch={false}
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TimeLogs;
