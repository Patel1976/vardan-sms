
import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col,
  Modal,
  Image
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faEye,
  faDownload,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import PageTitle from '../../components/PageTitle';
import DataTable from '../../components/DataTable';
import ActionButton from '../../components/ActionButton';

const EmergencyLogs = () => {
  // State for filter and modal
  const [filterData, setFilterData] = useState({
    fromDate: '',
    toDate: '',
    staffId: ''
  });
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  
  // Sample staff list
  const staffList = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
    { id: 4, name: 'Alice Williams' },
    { id: 5, name: 'Charlie Brown' },
  ];
  
  // Sample emergency logs
  const [logs, setLogs] = useState([
    { 
      id: 1, 
      staffId: 1,
      staffName: 'John Doe',
      date: '2023-06-15',
      time: '14:30',
      type: 'Medical',
      location: '123 Main St, New York',
      description: 'Staff member reported feeling unwell during work hours.',
      images: ['https://via.placeholder.com/600/771796'],
      status: 'resolved'
    },
    { 
      id: 2, 
      staffId: 2,
      staffName: 'Jane Smith',
      date: '2023-06-20',
      time: '10:15',
      type: 'Safety',
      location: '456 Elm St, Boston',
      description: 'Reported unsafe equipment at client site.',
      images: ['https://via.placeholder.com/600/d32776', 'https://via.placeholder.com/600/f66b97'],
      status: 'pending'
    },
    { 
      id: 3, 
      staffId: 3,
      staffName: 'Bob Johnson',
      date: '2023-07-05',
      time: '09:45',
      type: 'Security',
      location: '789 Oak St, Chicago',
      description: 'Encountered unauthorized person at work site.',
      images: ['https://via.placeholder.com/600/56a8c2'],
      status: 'resolved'
    },
    { 
      id: 4, 
      staffId: 4,
      staffName: 'Alice Williams',
      date: '2023-07-18',
      time: '16:20',
      type: 'Medical',
      location: '101 Pine St, San Francisco',
      description: 'Minor injury while handling equipment.',
      images: ['https://via.placeholder.com/600/b0f7cc', 'https://via.placeholder.com/600/54176f'],
      status: 'pending'
    },
    { 
      id: 5, 
      staffId: 5,
      staffName: 'Charlie Brown',
      date: '2023-08-02',
      time: '11:30',
      type: 'Other',
      location: '202 Maple St, Seattle',
      description: 'Vehicle breakdown during client visit.',
      images: [],
      status: 'resolved'
    },
  ]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData({
      ...filterData,
      [name]: value
    });
  };
  
  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, fetch filtered logs from API
    console.log('Filtering logs with:', filterData);
    
    // For demo, we're not actually filtering the data
    // In a real app, this would update the logs state with filtered data
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
        breadcrumbs={[{ text: 'Reports' }, { text: 'Emergency Logs' }]} 
      />
      
      <Card className="mb-4">
        <Card.Header>
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
                  <Form.Label>Staff Member</Form.Label>
                  <Form.Select
                    name="staffId"
                    value={filterData.staffId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Staff Members</option>
                    {staffList.map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2} className="d-flex align-items-end mb-3">
                <Button 
                  variant="primary" 
                  type="submit"
                  className="w-100"
                >
                  <FontAwesomeIcon icon={faSearch} className="me-1" />
                  Filter
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header className="text-xl fw-semibold">Emergency Logs List</Card.Header>
        
        <Card.Body>
          <DataTable 
            columns={columns} 
            data={logs} 
            showSearch={false}
          />
        </Card.Body>
      </Card>
      
      {/* Emergency Log Details Modal - Simplified to only show description and image */}
      <Modal
        show={showLogModal}
        onHide={handleCloseModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Emergency Log Details</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {selectedLog && (
            <div className="emergency-details">
              {/* Only show description and large image(s) */}
              <div className="mb-4">
                <h5>Description:</h5>
                <p className="emergency-description">{selectedLog.description}</p>
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
