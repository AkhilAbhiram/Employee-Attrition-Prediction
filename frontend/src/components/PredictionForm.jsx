import React, { useState } from "react";
import usePrediction from "../hooks/usePrediction";

const DUMMY_RECORD = {
  Age: 35,
  BusinessTravel: "Travel_Rarely",
  DailyRate: 1373,
  Department: "Research & Development",
  DistanceFromHome: 8,
  Education: 3,
  EducationField: "Medical",
  EnvironmentSatisfaction: 4,
  Gender: "Male",
  HourlyRate: 50,
  JobInvolvement: 3,
  JobLevel: 2,
  JobRole: "Laboratory Technician",
  JobSatisfaction: 3,
  MaritalStatus: "Single",
  MonthlyIncome: 5000,
  MonthlyRate: 9000,
  NumCompaniesWorked: 1,
  OverTime: "No",
  PercentSalaryHike: 12,
  PerformanceRating: 3,
  RelationshipSatisfaction: 3,
  StockOptionLevel: 0,
  TotalWorkingYears: 8,
  TrainingTimesLastYear: 2,
  WorkLifeBalance: 3,
  YearsAtCompany: 6,
  YearsInCurrentRole: 4,
  YearsSinceLastPromotion: 0,
  YearsWithCurrManager: 5
};

const PredictionForm = () => {
  const { predict, loading } = usePrediction();
  const [formData, setFormData] = useState(DUMMY_RECORD);
  const [activeTab, setActiveTab] = useState("general");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-convert numeric fields
    const numericFields = [
      "Age", "DailyRate", "DistanceFromHome", "Education", "HourlyRate",
      "JobInvolvement", "JobLevel", "JobSatisfaction", "EnvironmentSatisfaction",
      "MonthlyIncome", "MonthlyRate", "NumCompaniesWorked", "PercentSalaryHike",
      "PerformanceRating", "RelationshipSatisfaction", "StockOptionLevel",
      "TotalWorkingYears", "TrainingTimesLastYear", "WorkLifeBalance",
      "YearsAtCompany", "YearsInCurrentRole", "YearsSinceLastPromotion", "YearsWithCurrManager"
    ];
    
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? Number(value) : value
    });
  };

  const handleLoadDummy = () => {
    setFormData(DUMMY_RECORD);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    predict(formData);
  };

  return (
    <form className="glass-panel" onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Employee Metrics</h2>
        <button
          type="button"
          onClick={handleLoadDummy}
          className="btn-secondary"
          style={{ padding: "6px 12px", fontSize: "0.8rem" }}
        >
          Load Sample Record
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="form-tabs">
        <button
          type="button"
          className={`form-tab-btn ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          type="button"
          className={`form-tab-btn ${activeTab === "compensation" ? "active" : ""}`}
          onClick={() => setActiveTab("compensation")}
        >
          Compensation
        </button>
        <button
          type="button"
          className={`form-tab-btn ${activeTab === "tenure" ? "active" : ""}`}
          onClick={() => setActiveTab("tenure")}
        >
          Tenure
        </button>
        <button
          type="button"
          className={`form-tab-btn ${activeTab === "satisfaction" ? "active" : ""}`}
          onClick={() => setActiveTab("satisfaction")}
        >
          Satisfaction
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "general" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Age</label>
            <input type="number" name="Age" value={formData.Age} onChange={handleChange} className="form-control" required min="18" max="70" />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select name="Gender" value={formData.Gender} onChange={handleChange} className="form-control">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Marital Status</label>
            <select name="MaritalStatus" value={formData.MaritalStatus} onChange={handleChange} className="form-control">
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Distance From Home (km)</label>
            <input type="number" name="DistanceFromHome" value={formData.DistanceFromHome} onChange={handleChange} className="form-control" required min="1" max="100" />
          </div>
          <div className="form-group">
            <label className="form-label">Education Level</label>
            <select name="Education" value={formData.Education} onChange={handleChange} className="form-control">
              <option value={1}>1 - Below College</option>
              <option value={2}>2 - College</option>
              <option value={3}>3 - Bachelor</option>
              <option value={4}>4 - Master</option>
              <option value={5}>5 - Doctor</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Education Field</label>
            <select name="EducationField" value={formData.EducationField} onChange={handleChange} className="form-control">
              <option value="Life Sciences">Life Sciences</option>
              <option value="Medical">Medical</option>
              <option value="Marketing">Marketing</option>
              <option value="Technical Degree">Technical Degree</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Business Travel</label>
            <select name="BusinessTravel" value={formData.BusinessTravel} onChange={handleChange} className="form-control">
              <option value="Travel_Rarely">Travel Rarely</option>
              <option value="Travel_Frequently">Travel Frequently</option>
              <option value="Non-Travel">Non-Travel</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Overtime Work</label>
            <select name="OverTime" value={formData.OverTime} onChange={handleChange} className="form-control">
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === "compensation" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select name="Department" value={formData.Department} onChange={handleChange} className="form-control">
              <option value="Sales">Sales</option>
              <option value="Research & Development">Research & Development</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Job Role</label>
            <select name="JobRole" value={formData.JobRole} onChange={handleChange} className="form-control">
              <option value="Sales Executive">Sales Executive</option>
              <option value="Research Scientist">Research Scientist</option>
              <option value="Laboratory Technician">Laboratory Technician</option>
              <option value="Manufacturing Director">Manufacturing Director</option>
              <option value="Healthcare Representative">Healthcare Representative</option>
              <option value="Manager">Manager</option>
              <option value="Sales Representative">Sales Representative</option>
              <option value="Research Director">Research Director</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Job Level</label>
            <select name="JobLevel" value={formData.JobLevel} onChange={handleChange} className="form-control">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Income ($)</label>
            <input type="number" name="MonthlyIncome" value={formData.MonthlyIncome} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Rate ($)</label>
            <input type="number" name="MonthlyRate" value={formData.MonthlyRate} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Daily Rate ($)</label>
            <input type="number" name="DailyRate" value={formData.DailyRate} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Hourly Rate ($)</label>
            <input type="number" name="HourlyRate" value={formData.HourlyRate} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Salary Hike Percentage</label>
            <input type="number" name="PercentSalaryHike" value={formData.PercentSalaryHike} onChange={handleChange} className="form-control" required min="0" max="50" />
          </div>
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Stock Option Level</label>
            <select name="StockOptionLevel" value={formData.StockOptionLevel} onChange={handleChange} className="form-control">
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === "tenure" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Number of Companies Worked</label>
            <input type="number" name="NumCompaniesWorked" value={formData.NumCompaniesWorked} onChange={handleChange} className="form-control" required min="0" max="20" />
          </div>
          <div className="form-group">
            <label className="form-label">Total Working Years</label>
            <input type="number" name="TotalWorkingYears" value={formData.TotalWorkingYears} onChange={handleChange} className="form-control" required min="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Training Times Last Year</label>
            <input type="number" name="TrainingTimesLastYear" value={formData.TrainingTimesLastYear} onChange={handleChange} className="form-control" required min="0" max="10" />
          </div>
          <div className="form-group">
            <label className="form-label">Years At Company</label>
            <input type="number" name="YearsAtCompany" value={formData.YearsAtCompany} onChange={handleChange} className="form-control" required min="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Years In Current Role</label>
            <input type="number" name="YearsInCurrentRole" value={formData.YearsInCurrentRole} onChange={handleChange} className="form-control" required min="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Years Since Last Promotion</label>
            <input type="number" name="YearsSinceLastPromotion" value={formData.YearsSinceLastPromotion} onChange={handleChange} className="form-control" required min="0" />
          </div>
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Years With Current Manager</label>
            <input type="number" name="YearsWithCurrManager" value={formData.YearsWithCurrManager} onChange={handleChange} className="form-control" required min="0" />
          </div>
        </div>
      )}

      {activeTab === "satisfaction" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Environment Satisfaction</label>
            <select name="EnvironmentSatisfaction" value={formData.EnvironmentSatisfaction} onChange={handleChange} className="form-control">
              <option value={1}>1 - Low</option>
              <option value={2}>2 - Medium</option>
              <option value={3}>3 - High</option>
              <option value={4}>4 - Very High</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Job Involvement</label>
            <select name="JobInvolvement" value={formData.JobInvolvement} onChange={handleChange} className="form-control">
              <option value={1}>1 - Low</option>
              <option value={2}>2 - Medium</option>
              <option value={3}>3 - High</option>
              <option value={4}>4 - Very High</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Job Satisfaction</label>
            <select name="JobSatisfaction" value={formData.JobSatisfaction} onChange={handleChange} className="form-control">
              <option value={1}>1 - Low</option>
              <option value={2}>2 - Medium</option>
              <option value={3}>3 - High</option>
              <option value={4}>4 - Very High</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Relationship Satisfaction</label>
            <select name="RelationshipSatisfaction" value={formData.RelationshipSatisfaction} onChange={handleChange} className="form-control">
              <option value={1}>1 - Low</option>
              <option value={2}>2 - Medium</option>
              <option value={3}>3 - High</option>
              <option value={4}>4 - Very High</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Performance Rating</label>
            <select name="PerformanceRating" value={formData.PerformanceRating} onChange={handleChange} className="form-control">
              <option value={3}>3 - Excellent</option>
              <option value={4}>4 - Outstanding</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Work-Life Balance</label>
            <select name="WorkLifeBalance" value={formData.WorkLifeBalance} onChange={handleChange} className="form-control">
              <option value={1}>1 - Bad</option>
              <option value={2}>2 - Good</option>
              <option value={3}>3 - Better</option>
              <option value={4}>4 - Best</option>
            </select>
          </div>
        </div>
      )}

      <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: "160px", justifyContent: "center" }}>
          {loading ? "Calculating..." : "Predict Attrition"}
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;
