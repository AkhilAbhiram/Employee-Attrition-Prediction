import React, { useState } from "react";

const HistoryTable = ({ historyData }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterResult, setFilterResult] = useState("");

  // Filter history records based on search and filters
  const filteredHistory = historyData.filter((record) => {
    const matchesSearch = 
      record.JobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.prediction_id.toString().includes(searchTerm);
      
    const matchesDept = filterDepartment === "" || record.Department === filterDepartment;
    const matchesResult = filterResult === "" || record.prediction_label === filterResult;
    
    return matchesSearch && matchesDept && matchesResult;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Search & Filters */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by Job Role or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ flex: 2, minWidth: "200px" }}
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="form-control"
          style={{ flex: 1, minWidth: "150px" }}
        >
          <option value="">All Departments</option>
          <option value="Research & Development">R&D</option>
          <option value="Sales">Sales</option>
          <option value="Human Resources">HR</option>
        </select>
        <select
          value={filterResult}
          onChange={(e) => setFilterResult(e.target.value)}
          className="form-control"
          style={{ flex: 1, minWidth: "150px" }}
        >
          <option value="">All Results</option>
          <option value="Yes">Yes (Leave)</option>
          <option value="No">No (Stay)</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="glass-panel" style={{ padding: "0", overflowX: "auto" }}>
        {filteredHistory.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            No prediction records found matching filters.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--panel-border)", background: "rgba(255, 255, 255, 0.02)" }}>
                <th style={{ padding: "16px 20px" }}>ID</th>
                <th style={{ padding: "16px 20px" }}>Date</th>
                <th style={{ padding: "16px 20px" }}>Job Role</th>
                <th style={{ padding: "16px 20px" }}>Department</th>
                <th style={{ padding: "16px 20px" }}>Overtime</th>
                <th style={{ padding: "16px 20px" }}>Probability</th>
                <th style={{ padding: "16px 20px" }}>Attrition</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((record) => {
                const isLeave = record.prediction_label === "Yes";
                const labelColor = isLeave ? "var(--color-danger)" : "var(--color-success)";
                
                return (
                  <tr
                    key={record.prediction_id}
                    onClick={() => setSelectedRecord(record)}
                    style={{
                      borderBottom: "1px solid var(--panel-border)",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "16px 20px", fontWeight: "700" }}>#{record.prediction_id}</td>
                    <td style={{ padding: "16px 20px", color: "var(--text-secondary)" }}>{formatDate(record.predicted_at)}</td>
                    <td style={{ padding: "16px 20px", fontWeight: "500" }}>{record.JobRole}</td>
                    <td style={{ padding: "16px 20px", color: "var(--text-secondary)" }}>{record.Department}</td>
                    <td style={{ padding: "16px 20px" }}>{record.OverTime}</td>
                    <td style={{ padding: "16px 20px", fontWeight: "600" }}>{(record.probability * 100).toFixed(1)}%</td>
                    <td style={{ padding: "16px 20px", fontWeight: "800", color: labelColor }}>{record.prediction_label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Record Details Modal Overlay */}
      {selectedRecord && (
        <div
          onClick={() => setSelectedRecord(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel"
            style={{
              maxWidth: "700px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "0 0 30px rgba(6, 182, 212, 0.15)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--panel-border)", paddingBottom: "12px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                Prediction Details #{selectedRecord.prediction_id}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.5rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            {/* Model Outcome */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255, 255, 255, 0.03)", padding: "16px", borderRadius: "10px" }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Model Prediction</span>
                <h4 style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: selectedRecord.prediction_label === "Yes" ? "var(--color-danger)" : "var(--color-success)"
                }}>
                  {selectedRecord.prediction_label === "Yes" ? "LEAVE (YES)" : "STAY (NO)"}
                </h4>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Overall Attrition Risk</span>
                <h4 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)" }}>
                  {(selectedRecord.probability * 100).toFixed(1)}%
                </h4>
              </div>
            </div>

            {/* Stacking Breakdowns */}
            <div>
              <h4 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "10px" }}>Ensemble Base Learner Outputs:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", textAlign: "center" }}>
                <div style={{ padding: "10px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Random Forest</span>
                  <p style={{ fontWeight: "700", marginTop: "4px" }}>{(selectedRecord.rf_probability * 100).toFixed(1)}%</p>
                </div>
                <div style={{ padding: "10px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>LightGBM</span>
                  <p style={{ fontWeight: "700", marginTop: "4px" }}>{(selectedRecord.lgbm_probability * 100).toFixed(1)}%</p>
                </div>
                <div style={{ padding: "10px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "8px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Neural Network</span>
                  <p style={{ fontWeight: "700", marginTop: "4px" }}>{(selectedRecord.ann_probability * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Employee Parameters */}
            <div>
              <h4 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "10px" }}>Submitted Employee Parameters:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", fontSize: "0.85rem" }}>
                <div><strong style={{ color: "var(--text-secondary)" }}>Age:</strong> {selectedRecord.Age}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Gender:</strong> {selectedRecord.Gender}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Marital Status:</strong> {selectedRecord.MaritalStatus}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Department:</strong> {selectedRecord.Department}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Job Role:</strong> {selectedRecord.JobRole}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Job Level:</strong> {selectedRecord.JobLevel}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Monthly Income:</strong> ${selectedRecord.MonthlyIncome}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Overtime:</strong> {selectedRecord.OverTime}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Distance From Home:</strong> {selectedRecord.DistanceFromHome} km</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Job Satisfaction:</strong> {selectedRecord.JobSatisfaction}/4</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Environment Sat.:</strong> {selectedRecord.EnvironmentSatisfaction}/4</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Work-Life Balance:</strong> {selectedRecord.WorkLifeBalance}/4</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Years At Company:</strong> {selectedRecord.YearsAtCompany}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Total Work Years:</strong> {selectedRecord.TotalWorkingYears}</div>
                <div><strong style={{ color: "var(--text-secondary)" }}>Companies Worked:</strong> {selectedRecord.NumCompaniesWorked}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--panel-border)", paddingTop: "12px" }}>
              <button onClick={() => setSelectedRecord(null)} className="btn-secondary" style={{ padding: "8px 16px" }}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
