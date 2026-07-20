# 🔌 Backend API Documentation

The backend Flask API server runs by default on `http://localhost:5000` and exposes endpoints under the `/api` prefix.

---

## 1. Health Check
* **Endpoint**: `GET /api/health`
* **Purpose**: Checks if the backend server and its database connection are active.
* **Response**:
  ```json
  {
    "status": "healthy",
    "database": "connected"
  }
  ```

---

## 2. Make Prediction
* **Endpoint**: `POST /api/predict`
* **Purpose**: Run inference for a single employee and persist input and outputs.
* **Payload**: JSON dictionary containing 30 employee features:
  ```json
  {
    "Age": 35,
    "BusinessTravel": "Travel_Rarely",
    "DailyRate": 1373,
    "Department": "Research & Development",
    "DistanceFromHome": 8,
    "Education": 2,
    "EducationField": "Medical",
    "EnvironmentSatisfaction": 4,
    "Gender": "Male",
    "HourlyRate": 50,
    "JobInvolvement": 2,
    "JobLevel": 1,
    "JobRole": "Laboratory Technician",
    "JobSatisfaction": 3,
    "MaritalStatus": "Single",
    "MonthlyIncome": 2500,
    "MonthlyRate": 9000,
    "NumCompaniesWorked": 1,
    "OverTime": "No",
    "PercentSalaryHike": 12,
    "PerformanceRating": 3,
    "RelationshipSatisfaction": 2,
    "StockOptionLevel": 0,
    "TotalWorkingYears": 6,
    "TrainingTimesLastYear": 0,
    "WorkLifeBalance": 3,
    "YearsAtCompany": 6,
    "YearsInCurrentRole": 4,
    "YearsSinceLastPromotion": 0,
    "YearsWithCurrManager": 5
  }
  ```
* **Response**:
  ```json
  {
    "prediction": "No",
    "probability": 0.1245,
    "employee_id": 42,
    "base_predictions": {
      "random_forest": 0.1542,
      "lightgbm": 0.1102,
      "neural_network": 0.1384
    }
  }
  ```

---

## 3. History Log
* **Endpoint**: `GET /api/history`
* **Query Parameters**:
  - `limit` (optional): Max rows to retrieve (default: `100`).
* **Purpose**: Fetches the logs of previous employee predictions joined with their inputs.
* **Response**: Array of prediction records.

---

## 4. Dashboard Stats
* **Endpoint**: `GET /api/dashboard`
* **Purpose**: Calculates aggregate attrition analysis metrics for frontend charts.
* **Response**:
  ```json
  {
    "total_predictions": 12,
    "attrition_rate": 25.0,
    "attrition_by_department": [
      { "department": "Sales", "total": 4, "attrition": 2, "rate": 50.0 }
    ],
    "attrition_by_overtime": [
      { "overtime": "Yes", "total": 6, "attrition": 3, "rate": 50.0 }
    ],
    "attrition_by_jobrole": [
      { "job_role": "Sales Executive", "total": 4, "attrition": 2, "rate": 50.0 }
    ]
  }
  ```
