import { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserTie,
  faClipboardList,
  faExclamationTriangle,
  faGaugeHigh,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../components/PageTitle";
import CountUp from "react-countup";
import axios from "axios";
import { parseCookies } from "nookies";

const iconMap = {
  faUsers: faUsers,
  faUserTie: faUserTie,
  faClipboardList: faClipboardList,
  faExclamationTriangle: faExclamationTriangle,
};

const Dashboard = () => {
  // State for each API data
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const { token } = parseCookies();

  useEffect(() => {
    // Base URL of your Laravel backend API

    // Fetch all data in parallel
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes, notificationsRes] = await Promise.all([
          axios.get(`${API_BASE}stats`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_BASE}recent-activities`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_BASE}emergency-notifications`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setStats(statsRes.data);
        setActivities(activitiesRes.data);
        setNotifications(notificationsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <PageTitle title="Dashboard" />

      <Row>
        <Col lg={12}>
          <Card className="shadow">
            <Card.Header className="py-3">
              <h6 className="text-xl m-0 font-weight-bold text-s">Dashboard</h6>
              <h6 className="mt-2 dash-label">Welcome to the admin panel !!</h6>
            </Card.Header>
          </Card>
        </Col>
      </Row>
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
                          icon={iconMap[stat.icon]}
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
              <h6 className="m-0 font-weight-bold text-s">Recent Staff Activity</h6>
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
                  {activities.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.staffName}</td>
                      <td>{activity.activity}</td>
                      <td>{activity.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="shadow mb-4">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-s">Emergency Notifications</h6>
            </Card.Header>
            <Card.Body>
              {notifications.map((note, index) => (
                <div
                  key={index}
                  className={`alert alert-${note.type} mb-3`}
                  role="alert"
                >
                  <strong>{note.staffName}</strong> {note.message}{" "}
                  <strong>{note.location}</strong> - {note.time}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
