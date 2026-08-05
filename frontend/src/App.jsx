import React, { useState, useEffect } from 'react';

const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://employee-attrition-prediction-ibmh.onrender.com';

export default function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [apiStatus, setApiStatus] = useState('checking');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    employee_name: 'Alex Johnson',
    department: 'Research & Development',
    job_role: 'Software Engineer',
    age: 32,
    monthly_income: 5400,
    overtime: 'Yes',
    job_satisfaction: 2,
    work_life_balance: 2,
    environment_satisfaction: 3,
    years_at_company: 4,
    years_since_last_promotion: 3,
    distance_from_home: 18
  });

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('offline');
      }
    } catch (err) {
      setApiStatus('offline');
    }
  };

  const loadDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard`);
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/history`);
      if (res.ok) {
        const data = await res.json();
        setHistoryData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') loadDashboard();
    if (activeTab === 'history') loadHistory();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Unable to reach prediction service. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoGroup}>
          <div style={styles.badgeIcon}>⚡</div>
          <div>
            <h1 style={styles.title}>Employee Attrition Prediction AI</h1>
            <p style={styles.subtitle}>Predict risk & optimize talent retention using machine learning</p>
          </div>
        </div>
        <div style={styles.statusChip}>
          <span style={{
            ...styles.statusDot,
            backgroundColor: apiStatus === 'connected' ? '#10b981' : '#f59e0b'
          }} />
          <span style={styles.statusText}>
            Backend: {apiStatus === 'connected' ? 'Connected (Render API)' : 'Connecting / Local'}
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div style={styles.navBar}>
        <button
          onClick={() => setActiveTab('predict')}
          style={{ ...styles.navButton, ...(activeTab === 'predict' ? styles.navActive : {}) }}
        >
          🎯 Risk Predictor
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{ ...styles.navButton, ...(activeTab === 'dashboard' ? styles.navActive : {}) }}
        >
          📊 Analytics Dashboard
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{ ...styles.navButton, ...(activeTab === 'history' ? styles.navActive : {}) }}
        >
          📜 Prediction History
        </button>
      </div>

      {/* Main Tab Content */}
      <main style={styles.main}>
        {activeTab === 'predict' && (
          <div style={styles.grid2}>
            {/* Form */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Employee Parameters</h2>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Employee Name</label>
                  <input
                    type="text"
                    name="employee_name"
                    value={formData.employee_name}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Department</label>
                    <select name="department" value={formData.department} onChange={handleChange} style={styles.select}>
                      <option value="Research & Development">Research & Development</option>
                      <option value="Sales">Sales</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Job Role</label>
                    <input
                      type="text"
                      name="job_role"
                      value={formData.job_role}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      style={styles.input}
                      min="18" max="70"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Monthly Income ($)</label>
                    <input
                      type="number"
                      name="monthly_income"
                      value={formData.monthly_income}
                      onChange={handleChange}
                      style={styles.input}
                      step="500"
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>OverTime Required?</label>
                    <select name="overtime" value={formData.overtime} onChange={handleChange} style={styles.select}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Distance From Home (km)</label>
                    <input
                      type="number"
                      name="distance_from_home"
                      value={formData.distance_from_home}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Job Satisfaction (1-4)</label>
                    <select name="job_satisfaction" value={formData.job_satisfaction} onChange={handleChange} style={styles.select}>
                      <option value="1">1 - Low</option>
                      <option value="2">2 - Medium</option>
                      <option value="3">3 - High</option>
                      <option value="4">4 - Very High</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Work-Life Balance (1-4)</label>
                    <select name="work_life_balance" value={formData.work_life_balance} onChange={handleChange} style={styles.select}>
                      <option value="1">1 - Bad</option>
                      <option value="2">2 - Good</option>
                      <option value="3">3 - Better</option>
                      <option value="4">4 - Best</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? 'Analyzing Neural Model...' : 'Calculate Attrition Risk'}
                </button>
              </form>
            </div>

            {/* Results Display */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Prediction Assessment</h2>
              {result ? (
                <div style={styles.resultBox}>
                  <div style={{
                    ...styles.scoreBadge,
                    borderColor: result.risk_score >= 0.6 ? '#ef4444' : result.risk_score >= 0.35 ? '#f59e0b' : '#10b981'
                  }}>
                    <div style={styles.scoreNumber}>{result.risk_percentage}</div>
                    <div style={{
                      ...styles.riskTag,
                      backgroundColor: result.risk_score >= 0.6 ? 'rgba(239, 68, 68, 0.2)' : result.risk_score >= 0.35 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: result.risk_score >= 0.6 ? '#fca5a5' : result.risk_score >= 0.35 ? '#fde68a' : '#6ee7b7'
                    }}>
                      {result.risk_level}
                    </div>
                  </div>

                  <div style={styles.sectionDivider} />

                  <h4 style={styles.sectionHeading}>Key Attrition Risk Drivers</h4>
                  <ul style={styles.factorList}>
                    {result.top_factors.map((factor, idx) => (
                      <li key={idx} style={styles.factorItem}>⚠️ {factor}</li>
                    ))}
                  </ul>

                  <h4 style={styles.sectionHeading}>Actionable HR Recommendations</h4>
                  <div style={styles.recBox}>
                    {result.recommendations.map((rec, idx) => (
                      <div key={idx} style={styles.recItem}>🔹 {rec}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                  <p style={{ color: '#94a3b8' }}>Fill out employee metrics and click <strong>Calculate Attrition Risk</strong> to view real-time AI risk scoring.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Organization Retention Analytics</h2>
            {dashboardData ? (
              <div style={styles.dashboardGrid}>
                <div style={styles.metricCard}>
                  <span style={styles.metricTitle}>Overall Attrition Rate</span>
                  <span style={styles.metricVal}>{dashboardData.overall_attrition_rate}</span>
                </div>
                <div style={styles.metricCard}>
                  <span style={styles.metricTitle}>Employees Monitored</span>
                  <span style={styles.metricVal}>{dashboardData.total_employees_analyzed}</span>
                </div>
                <div style={styles.metricCard}>
                  <span style={styles.metricTitle}>High Risk Employees</span>
                  <span style={{ ...styles.metricVal, color: '#ef4444' }}>{dashboardData.high_risk_count}</span>
                </div>
              </div>
            ) : (
              <p style={{ color: '#94a3b8' }}>Loading dashboard metrics...</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Recent Predictions Log</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Employee</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Score</th>
                    <th style={styles.th}>Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((item) => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}><strong>{item.employee_name}</strong></td>
                      <td style={styles.td}>{item.department}</td>
                      <td style={styles.td}>{item.job_role}</td>
                      <td style={styles.td}>{(item.risk_score * 100).toFixed(0)}%</td>
                      <td style={styles.td}>
                        <span style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          backgroundColor: item.risk_score >= 0.6 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: item.risk_score >= 0.6 ? '#fca5a5' : '#6ee7b7'
                        }}>
                          {item.risk_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  badgeIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.9rem'
  },
  statusChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(30, 41, 59, 0.8)',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  statusText: {
    fontSize: '0.85rem',
    color: '#cbd5e1'
  },
  navBar: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '0.75rem'
  },
  navButton: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'all 0.2s'
  },
  navActive: {
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#818cf8',
    fontWeight: '600'
  },
  main: {
    marginTop: '1rem'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '1.75rem'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
    color: '#f8fafc'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flex: 1
  },
  formRow: {
    display: 'flex',
    gap: '1rem'
  },
  label: {
    fontSize: '0.85rem',
    color: '#cbd5e1',
    fontWeight: '500'
  },
  input: {
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '0.6rem 0.8rem',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none'
  },
  select: {
    background: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '0.6rem 0.8rem',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none'
  },
  submitBtn: {
    marginTop: '0.5rem',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    border: 'none',
    padding: '0.8rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem'
  },
  resultBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  scoreBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '2px solid',
    background: 'rgba(15, 23, 42, 0.5)'
  },
  scoreNumber: {
    fontSize: '3rem',
    fontWeight: '800'
  },
  riskTag: {
    padding: '0.3rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginTop: '0.5rem'
  },
  sectionDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)'
  },
  sectionHeading: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    fontWeight: '600'
  },
  factorList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  factorItem: {
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '0.6rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.88rem',
    color: '#f8fafc'
  },
  recBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  recItem: {
    fontSize: '0.88rem',
    color: '#cbd5e1',
    lineHeight: '1.4'
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  metricCard: {
    background: 'rgba(15, 23, 42, 0.7)',
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  metricTitle: {
    fontSize: '0.85rem',
    color: '#94a3b8'
  },
  metricVal: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#818cf8'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.9rem'
  },
  thRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  th: {
    padding: '0.75rem',
    color: '#94a3b8',
    fontWeight: '600'
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  td: {
    padding: '0.75rem',
    color: '#cbd5e1'
  }
};
