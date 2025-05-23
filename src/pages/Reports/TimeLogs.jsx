import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFileExport,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import DataTable from "../../components/DataTable";

const TimeLogs = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const staffIdFromUrl = searchParams.get("staffId");

  // State for filter
  const [filterData, setFilterData] = useState({
    fromDate: "",
    toDate: "",
    staffId: staffIdFromUrl || "",
  });

  // Sample staff list
  const staffList = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
    { id: 4, name: "Alice Williams" },
    { id: 5, name: "Charlie Brown" },
  ];

  // Sample time logs
  const [logs, setLogs] = useState([
    {
      id: 1,
      staffId: 1,
      staffName: "John Doe",
      date: "2023-06-15",
      checkIn: "09:00",
      checkOut: "17:30",
      totalHours: "8.5",
      workLocation: "Office",
      notes: "Regular work day",
    },
    {
      id: 2,
      staffId: 1,
      staffName: "John Doe",
      date: "2023-06-16",
      checkIn: "08:45",
      checkOut: "17:15",
      totalHours: "8.5",
      workLocation: "Office",
      notes: "Regular work day",
    },
    {
      id: 3,
      staffId: 2,
      staffName: "Jane Smith",
      date: "2023-06-15",
      checkIn: "09:15",
      checkOut: "18:00",
      totalHours: "8.75",
      workLocation: "Remote",
      notes: "Working from home",
    },
    {
      id: 4,
      staffId: 2,
      staffName: "Jane Smith",
      date: "2023-06-16",
      checkIn: "09:30",
      checkOut: "17:45",
      totalHours: "8.25",
      workLocation: "Remote",
      notes: "Working from home",
    },
    {
      id: 5,
      staffId: 3,
      staffName: "Bob Johnson",
      date: "2023-06-15",
      checkIn: "08:30",
      checkOut: "16:45",
      totalHours: "8.25",
      workLocation: "Client Site",
      notes: "Working at ABC Corp",
    },
    {
      id: 6,
      staffId: 4,
      staffName: "Alice Williams",
      date: "2023-06-15",
      checkIn: "09:00",
      checkOut: "17:00",
      totalHours: "8",
      workLocation: "Office",
      notes: "",
    },
    {
      id: 7,
      staffId: 5,
      staffName: "Charlie Brown",
      date: "2023-06-15",
      checkIn: "10:00",
      checkOut: "19:00",
      totalHours: "9",
      workLocation: "Office",
      notes: "Stayed late to complete project",
    },
  ]);

  // Filter logs based on staff ID from URL
  useEffect(() => {
    if (staffIdFromUrl) {
      // In a real app, fetch logs for this staff ID from API
      console.log(`Loading logs for staff ID: ${staffIdFromUrl}`);

      // For demo, we're not actually filtering, but in a real app this would update the logs state
    }
  }, [staffIdFromUrl]);

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

    // In a real app, fetch filtered logs from API
    console.log("Filtering logs with:", filterData);

    // For demo, we're not actually filtering the data
    // In a real app, this would update the logs state with filtered data
  };

  // Handle export logs
  const handleExportLogs = () => {
    console.log("Exporting logs with filters:", filterData);
    alert("Time logs export started. File will be downloaded shortly.");
  };

  // Table columns configuration
  const columns = [
    { field: "date", header: "Date" },
    { field: "staffName", header: "Staff Name" },
    { field: "checkIn", header: "Check In" },
    { field: "checkOut", header: "Check Out" },
    { field: "totalHours", header: "Total Hours" },
    {
      field: "workLocation",
      header: "Location",
    },
    { field: "notes", header: "Notes" },
  ];

  // Create actions for data table
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
                  <Form.Select
                    name="staffId"
                    value={filterData.staffId}
                    onChange={handleFilterChange}
                  >
                    <option value="" disabled hidden>
                      All Staff Members
                    </option>
                    {staffList.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </Form.Select>
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
            {staffIdFromUrl && (
              <Badge bg="info" className="ms-2">
                Filtered by Staff:{" "}
                {
                  staffList.find((s) => s.id.toString() === staffIdFromUrl)
                    ?.name
                }
              </Badge>
            )}
          </div>
        </Card.Header>

        <Card.Body>
          <DataTable
            columns={columns}
            data={logs}
            actions={tableActions}
            showSearch={false}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default TimeLogs;
