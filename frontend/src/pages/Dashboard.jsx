import React, { useEffect } from "react";
import usePrediction from "../hooks/usePrediction";
import DashboardCard from "../components/DashboardCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { dashboardStats, loadDashboardStats, loading } = usePrediction();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  if (loading && !dashboardStats) {
    return <LoadingSpinner />;
  }

  // Handle empty dashboard state
  if (!dashboardStats || dashboardStats.total_predictions === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📈</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>No Data Available</h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "450px", margin: "0 auto 20px" }}>
          The dashboard metrics require prediction history to display analytics. Go to the Predictor tab and make a prediction!
        </p>
      </div>
    );
  }

  const {
    total_predictions,
    attrition_rate,
    attrition_by_department,
    attrition_by_overtime,
    attrition_by_jobrole,
  } = dashboardStats;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      
      {/* Page Header */}
      <header>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
          Attrition Analytics
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "4px" }}>
          Aggregated flight risk patterns across roles, departments, and work styles.
        </p>
      </header>

      {/* Metric Cards Row */}
      <div className="dashboard-grid">
        <DashboardCard
          title="Total Predictions"
          value={total_predictions}
          icon="👥"
          color="var(--accent-blue)"
        />
        <DashboardCard
          title="Avg Attrition Risk"
          value={`${attrition_rate}%`}
          icon="🔥"
          color={attrition_rate > 50 ? "var(--color-danger)" : "var(--color-success)"}
          glow={attrition_rate > 35}
        />
        <DashboardCard
          title="High Risk Areas"
          value={attrition_by_department.filter(d => d.rate > 20).length}
          icon="⚠️"
          color="var(--color-warning)"
        />
      </div>

      {/* Grid of Custom SVG Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        
        {/* Chart 1: Attrition by Department */}
        <div className="glass-panel">
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", borderBottom: "1px solid var(--panel-border)", paddingBottom: "12px", marginBottom: "16px" }}>
            Attrition Rate by Department
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {attrition_by_department.map((dept) => (
              <div key={dept.department} className="chart-bar-group">
                <div className="chart-bar-label">
                  <span>{dept.department}</span>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{dept.rate}% ({dept.attrition}/{dept.total})</span>
                </div>
                <div className="chart-bar-bg">
                  <div className="chart-bar-fill" style={{ width: `${dept.rate}%`, background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Attrition by Overtime */}
        <div className="glass-panel">
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", borderBottom: "1px solid var(--panel-border)", paddingBottom: "12px", marginBottom: "16px" }}>
            Attrition Rate by Overtime
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {attrition_by_overtime.map((ot) => (
              <div key={ot.overtime} className="chart-bar-group">
                <div className="chart-bar-label">
                  <span>Overtime: {ot.overtime}</span>
                  <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{ot.rate}% ({ot.attrition}/{ot.total})</span>
                </div>
                <div className="chart-bar-bg">
                  <div className="chart-bar-fill" style={{ width: `${ot.rate}%`, background: ot.overtime === "Yes" ? "var(--color-danger)" : "var(--color-success)" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Chart 3: Attrition by Job Role (Full width list) */}
      <div className="glass-panel" style={{ width: "100%" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", borderBottom: "1px solid var(--panel-border)", paddingBottom: "12px", marginBottom: "16px" }}>
          Attrition Rate by Job Role
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {attrition_by_jobrole.map((role) => (
            <div key={role.job_role} className="chart-bar-group">
              <div className="chart-bar-label">
                <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "180px" }}>{role.job_role}</span>
                <span style={{ fontWeight: "600" }}>{role.rate}%</span>
              </div>
              <div className="chart-bar-bg" style={{ height: "8px" }}>
                <div className="chart-bar-fill" style={{ width: `${role.rate}%`, background: "var(--accent-pink)" }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
