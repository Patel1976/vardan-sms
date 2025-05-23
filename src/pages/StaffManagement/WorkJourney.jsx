import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowLeft,
  faMapMarkedAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import PageTitle from "../../components/PageTitle";

const WorkJourney = () => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });
  const [showMap, setShowMap] = useState(false);

  // Sample staff list
  const staffList = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
    { id: 4, name: "Alice Williams" },
    { id: 5, name: "Charlie Brown" },
  ];

  // Sample journey path (would come from API in real app)
  const journeyPath = [
    { lat: 40.712776, lng: -74.005974, time: "09:00 AM" }, // New York
    { lat: 40.73061, lng: -73.935242, time: "10:30 AM" }, // Brooklyn
    { lat: 40.758896, lng: -73.98513, time: "12:15 PM" }, // Manhattan
    { lat: 40.742054, lng: -73.769417, time: "02:45 PM" }, // Queens
    { lat: 40.837048, lng: -73.865433, time: "04:30 PM" }, // Bronx
  ];

  // Map center (avg of all points)
  const mapCenter = {
    lat:
      journeyPath.reduce((sum, point) => sum + point.lat, 0) /
      journeyPath.length,
    lng:
      journeyPath.reduce((sum, point) => sum + point.lng, 0) /
      journeyPath.length,
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "staff") {
      setSelectedStaff(value);
      setShowMap(false);
    } else {
      setDateRange({
        ...dateRange,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // No validation required - all fields optional

    // In a real app, fetch journey data from API
    console.log("Fetching journey for:", {
      staffId: selectedStaff || "all",
      fromDate: dateRange.fromDate || "all dates",
      toDate: dateRange.toDate || "all dates",
    });

    // Show map
    setShowMap(true);
  };

  // Load Google Maps JavaScript API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API key
    libraries: ["places"],
  });

  // Back to selection
  const handleBack = () => {
    setShowMap(false);
  };

  // Filter journey data
  const handleFilterJourney = () => {
    console.log("Filtering journey data with:", dateRange);
    // In a real app, this would filter the journey data based on date range
  };

  return (
    <div className="work-journey">
      <PageTitle
        title="Work Journey"
        breadcrumbs={[{ text: "Work Journey" }]}
      />

      {!showMap ? (
        <Card>
          <Card.Header className="text-xl fw-semibold">Work Logs</Card.Header>

          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3" controlId="selectStaff">
                    <Form.Label>Select a Staff</Form.Label>
                    <Form.Select
                      name="staff"
                      value={selectedStaff}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled hidden>
                        Search Staff by Name...
                      </option>
                      {staffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3" controlId="fromDate">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="fromDate"
                      value={dateRange.fromDate}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3" controlId="toDate">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="toDate"
                      value={dateRange.toDate}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center mt-3">
                <Button variant="primary" type="submit" className="px-4">
                  <FontAwesomeIcon icon={faSearch} className="me-2" />
                  View Journey
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <span>Journey Map for </span>
                <strong>
                  {selectedStaff
                    ? staffList.find(
                        (s) => s.id.toString() === selectedStaff.toString()
                      )?.name
                    : "All Staff"}
                </strong>
              </div>

              <div className="d-flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleBack}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                  Back
                </Button>
              </div>
            </Card.Header>

            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group className="mb-3" controlId="journeyFromDate">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="fromDate"
                      value={dateRange.fromDate}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3" controlId="journeyToDate">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="toDate"
                      value={dateRange.toDate}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4} className="d-flex align-items-end">
                  <Button
                    variant="primary"
                    onClick={handleFilterJourney}
                    className="mb-3"
                  >
                    <FontAwesomeIcon icon={faSearch} className="me-1" />
                    Filter
                  </Button>
                </Col>
              </Row>

              {isLoaded ? (
                <div className="map-container">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "500px" }}
                    center={mapCenter}
                    zoom={12}
                  >
                    {/* Journey markers */}
                    {journeyPath.map((point, index) => (
                      <Marker
                        key={index}
                        position={{ lat: point.lat, lng: point.lng }}
                        label={(index + 1).toString()}
                      />
                    ))}

                    {/* Journey path line */}
                    <Polyline
                      path={journeyPath}
                      options={{
                        strokeColor: "#F6861F",
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                      }}
                    />
                  </GoogleMap>
                </div>
              ) : (
                <Alert variant="info">Loading map...</Alert>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Journey Timeline</Card.Header>
            <Card.Body>
              <div className="journey-timeline">
                {journeyPath.map((point, index) => (
                  <div
                    key={index}
                    className="timeline-item d-flex align-items-start mb-3"
                  >
                    <div
                      className="timeline-badge me-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#bd9a68",
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      <FontAwesomeIcon icon={faMapMarkedAlt} />
                    </div>

                    <div className="timeline-content">
                      <h6 className="mb-0">Location {index + 1}</h6>
                      <p className="small text-muted mb-0">
                        {point.time} - Lat: {point.lat.toFixed(6)}, Lng:{" "}
                        {point.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default WorkJourney;
