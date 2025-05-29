import React, { useState, useEffect } from "react";
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
import SearchStaff from "../../components/searchStaff";
import axios from "axios";
import { parseCookies } from "nookies";

const libraries = ["places"];

const WorkJourney = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });
  const [showMap, setShowMap] = useState(false);
  const [journeyPath, setJourneyPath] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(false);

  const API_URL_STAFF = import.meta.env.VITE_BASE_URL_STAFF;
  const MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
  const { token } = parseCookies();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: MAPS_API_KEY,
    libraries,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  const handleBack = () => {
    setShowMap(false);
    setJourneyPath([]);
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
  };

  const fetchJourneyData = async () => {
    if (!selectedStaff || !selectedStaff.uuid) return;

    try {
      setLoading(true);
      const requestData = {
        uuid: selectedStaff.uuid,
        ...(dateRange.fromDate && { start_date: dateRange.fromDate }),
        ...(dateRange.toDate && { end_date: dateRange.toDate }),
        token: token,
      };
      const response = await axios.post(
        `${API_URL_STAFF}get-staff-locations/${selectedStaff.uuid}`, requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.locations || [];

      const transformed = data.map((item) => {
        const timestamp = Number(item.created_at?.$date?.$numberLong);
        const time = timestamp
          ? new Date(timestamp).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          : "Invalid Date";
        return {
          lat: Number(item.latitude),
          lng: Number(item.longitude),
          time,
        };
      });

      setJourneyPath(transformed);

      if (transformed.length > 0) {
        setMapCenter({ lat: transformed[0].lat, lng: transformed[0].lng });
      }

    } catch (error) {
      console.error("Error fetching journey data:", error);
      alert("Failed to fetch journey data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchJourneyData();
    setShowMap(true);
  };

  const handleFilterJourney = async () => {
    await fetchJourneyData();
  };

  return (
    <div className="work-journey">
      <PageTitle title="Work Journey" breadcrumbs={[{ text: "Work Journey" }]} />

      {!showMap ? (
        <Card>
          <Card.Header className="text-xl fw-semibold">Work Logs</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select a Staff</Form.Label>
                    <SearchStaff
                      onSelectedOptionsChange={handleStaffSelect}
                      staffName={selectedStaff}
                      token={token}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
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
                  <Form.Group className="mb-3">
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
                Journey Map for <strong>{selectedStaff?.label}</strong>
              </div>
              <Button variant="secondary" size="sm" onClick={handleBack}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                Back
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
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
                  <Form.Group>
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
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faSearch} className="me-1" />
                    Filter
                  </Button>
                </Col>
              </Row>

              {isLoaded ? (
                journeyPath.length > 0 ? (
                  <div className="map-container">
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "500px" }}
                      center={mapCenter}
                      zoom={14}
                    >
                      {journeyPath.map((point, index) => (
                        <Marker
                          key={index}
                          position={{ lat: point.lat, lng: point.lng }}
                          label={(index + 1).toString()}
                        />
                      ))}
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
                  <Alert variant="warning">No journey data found for the selected filters.</Alert>
                )
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
                        {point.time} - Lat: {point.lat}, Lng: {point.lng}
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