import { useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserTie,
  faClipboardList,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../components/PageTitle";
import CountUp from "react-countup";

const Dashboard = () => {
  useEffect(() => {});

  // Sample stats
  const stats = [
    {
      title: "Total Staff",
      value: 125,
      icon: faUsers,
      color: "#bd9a68",
      background: "rgb(189 154 104 / 20%)",
      border: "1px solid rgb(189 154 104 / 30%)",
    },
    {
      title: "Active Staff",
      value: 87,
      icon: faUserTie,
      color: "#4caf50",
      background: "rgb(76 175 80 / 20%)",
      border: "1px solid rgb(76 175 80 / 30%)",
    },
    {
      title: "Time Logs Today",
      value: 254,
      icon: faClipboardList,
      color: "#2196f3",
      background: "rgb(33 150 243 / 20%)",
      border: "1px solid rgb(33 150 243 / 30%)",
    },
    {
      title: "Emergency Alerts",
      value: 3,
      icon: faExclamationTriangle,
      color: "#f44336",
      background: "rgb(244 67 54 / 20%)",
      border: "1px solid rgb(244 67 54 / 30%)",
    },
  ];

  return (
    <div className="dashboard">
      <PageTitle title="Dashboard" />

      <Row>
        {stats.map((stat, index) => (
          <Col xl={3} md={6} className="mb-4" key={index}>
            <Card className="shadow h-100 py-2 mb-0">
              <Card.Body>
                <Row className="no-gutters align-items-center">
                  <Col className="mr-2">
                    <div className="h6 text-s font-weight-bold text-uppercase mb-1">
                      {stat.title}
                    </div>
                    <div className="h1 mb-0 font-weight-bold">
                      <CountUp end={stat.value} duration={5} />
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="icon-wave-container">
                      <span
                        className="icon-wrapper"
                        style={{
                          backgroundColor: stat.background,
                          border: stat.border,
                          color: stat.color,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={stat.icon}
                          style={{
                            width: 40,
                            height: 40,
                            zIndex: 2,
                            position: "relative",
                          }}
                        />
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="shadow mb-4">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-s">
                Recent Staff Activity
              </h6>
            </Card.Header>
            <Card.Body>
              <table className="table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Activity</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>Checked in</td>
                    <td>Today, 09:15 AM</td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>Checked out</td>
                    <td>Today, 05:30 PM</td>
                  </tr>
                  <tr>
                    <td>Michael Johnson</td>
                    <td>Reported emergency</td>
                    <td>Today, 02:45 PM</td>
                  </tr>
                  <tr>
                    <td>Linda Williams</td>
                    <td>Checked in</td>
                    <td>Today, 08:50 AM</td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="shadow mb-4">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-s">
                Emergency Notifications
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="alert alert-danger mb-3">
                <strong>Michael Johnson</strong> reported an emergency at{" "}
                <strong>Main St. Location</strong> - 02:45 PM
              </div>
              <div className="alert alert-warning mb-3">
                <strong>Susan Miller</strong> requested assistance at{" "}
                <strong>Downtown Office</strong> - 11:20 AM
              </div>
              <div className="alert alert-danger mb-3">
                <strong>Robert Brown</strong> reported an emergency at{" "}
                <strong>Warehouse B</strong> - Yesterday, 4:30 PM
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
