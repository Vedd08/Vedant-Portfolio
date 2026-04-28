import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      
      const [statsRes, projectsRes] = await Promise.all([
        axios.get(`${API_URL}/views/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setStats(statsRes.data);
      setProjects(projectsRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
        }, 2000);
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const chartData = {
    labels: stats?.dailyStats?.map(d => d.date) || [],
    datasets: [
      {
        label: 'Page Views',
        data: stats?.dailyStats?.map(d => d.views) || [],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#2563EB',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#E2E8F0',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#E2E8F0', drawBorder: false },
        ticks: { stepSize: 1, color: '#64748B' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748B' }
      }
    }
  };

  const statCards = [
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: '👁️',
      color: '#2563EB',
      bg: '#EFF6FF'
    },
    {
      title: 'Unique Visitors',
      value: stats?.uniqueVisitors || 0,
      icon: '👤',
      color: '#14B8A6',
      bg: '#F0FDFA'
    },
    {
      title: 'This Week',
      value: stats?.weekViews || 0,
      icon: '📊',
      color: '#22C55E',
      bg: '#F0FDF4'
    },
    {
      title: 'Total Projects',
      value: projects.length,
      icon: '📁',
      color: '#8B5CF6',
      bg: '#F5F3FF'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of your portfolio performance</p>
          </div>
          <Button 
            variant="light" 
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="refresh-btn"
          >
            {refreshing ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            )}
            <span className="ms-2">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
        </div>
        {lastUpdated && (
          <p className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {error && (
        <div className="error-alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        {statCards.map((stat, index) => (
          <Col key={index} md={6} lg={3}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-header">
                  <span className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </span>
                </div>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.title}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Chart & Recent Views */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="chart-card">
            <Card.Header className="card-header">
              <h3 className="card-title">Views (Last 7 Days)</h3>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                {stats?.dailyStats && stats.dailyStats.some(d => d.views > 0) ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="no-data">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
                      <circle cx="12" cy="16" r="5" />
                      <path d="M12 11v5" />
                    </svg>
                    <p>No view data yet. Share your portfolio to get started!</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="recent-card">
            <Card.Header className="card-header">
              <h3 className="card-title">Recent Views</h3>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="recent-list">
                {stats?.recentViews && stats.recentViews.length > 0 ? (
                  stats.recentViews.map((view, index) => (
                    <div key={index} className="recent-item">
                      <div className="recent-info">
                        <div>
                          <span className="recent-page">{view.page || 'Home'}</span>
                          <span className="recent-ip">{view.ip}</span>
                        </div>
                        <span className="recent-time">{formatTime(view.timestamp)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-recent">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    <p>No recent views</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Projects */}
      <Row className="mt-4">
        <Col lg={12}>
          <Card className="projects-card">
            <Card.Header className="card-header">
              <h3 className="card-title">Recent Projects</h3>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="admin-table mb-0" hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Tech Stack</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.slice(0, 5).map((project) => (
                      <tr key={project._id}>
                        <td className="fw-medium">{project.title}</td>
                        <td>
                          <div className="tech-badges">
                            {project.techStack?.slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="tech-badge">{tech}</span>
                            ))}
                            {project.techStack?.length > 3 && (
                              <span className="tech-badge">+{project.techStack.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;