<![CDATA[# 🏢 Employee Attrition Prediction

An AI-powered full-stack web application that predicts employee attrition risk using machine learning. HR teams can input employee data, receive instant risk assessments with actionable recommendations, and track prediction history — all through a modern, intuitive dashboard.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#-api-reference)
- [ML Model](#-ml-model)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **🔮 Attrition Risk Prediction** — Enter employee attributes (age, income, satisfaction, overtime, etc.) and receive an instant risk score with a High / Medium / Low classification.
- **📊 Interactive Dashboard** — View organization-wide attrition metrics, department breakdowns, and top attrition drivers at a glance.
- **📜 Prediction History** — Automatically persisted prediction logs with Supabase, enabling historical analysis and auditing.
- **💡 Actionable Recommendations** — Each prediction includes tailored HR action items to mitigate attrition risk.
- **⚡ Real-time Risk Factors** — Transparent explanations of which factors are contributing most to each employee's risk score.
- **🌐 Cloud-Ready** — Designed for deployment on Vercel (frontend) and Render (backend) with CI/CD workflows.

---

## 🛠 Tech Stack

| Layer         | Technology                                                  |
|---------------|-------------------------------------------------------------|
| **Frontend**  | React 18, Vite 5, Lucide Icons, Axios                      |
| **Backend**   | Python, Flask, Flask-CORS, Gunicorn                         |
| **ML/AI**     | Scikit-learn, Pandas, NumPy, Joblib                         |
| **Database**  | Supabase (PostgreSQL)                                       |
| **Styling**   | CSS3 with Inter font (Google Fonts)                         |
| **Deployment**| Vercel (frontend), Render (backend), GitHub Actions (CI/CD) |

---

## 🏗 Architecture

```
┌─────────────────────┐       HTTPS        ┌─────────────────────┐
│                     │  ◄──────────────►   │                     │
│   React Frontend    │                     │   Flask Backend     │
│   (Vercel)          │     REST API        │   (Render)          │
│                     │                     │                     │
│  • Dashboard        │                     │  • /api/predict     │
│  • Prediction Form  │                     │  • /api/dashboard   │
│  • History View     │                     │  • /api/history     │
│  • About Page       │                     │  • /health          │
│                     │                     │                     │
└─────────────────────┘                     └────────┬────────────┘
                                                     │
                                                     │ Supabase SDK
                                                     ▼
                                            ┌─────────────────────┐
                                            │   Supabase          │
                                            │   (PostgreSQL)      │
                                            │                     │
                                            │  • predictions      │
                                            │    table             │
                                            └─────────────────────┘
```

---

## 📁 Project Structure

```
Employee-Attrition-Prediction/
├── .github/
│   └── workflows/
│       ├── backend.yml           # Backend CI/CD workflow
│       └── frontend.yml          # Frontend CI/CD workflow
│
├── backend/
│   ├── database/
│   │   ├── db.py                 # Database connection utilities
│   │   ├── employee.py           # Employee data models
│   │   └── prediction.py         # Prediction data models
│   ├── ml/
│   │   ├── predictor.py          # ML prediction logic
│   │   ├── preprocessing.py      # Data preprocessing pipeline
│   │   └── utils.py              # ML helper utilities
│   ├── models/
│   │   ├── ann_model.h5          # Trained ANN model weights
│   │   ├── feature_columns.pkl   # Feature column definitions
│   │   ├── label_encoder.pkl     # Label encoder artifact
│   │   └── scaler.pkl            # Feature scaler artifact
│   ├── routes/
│   │   ├── dashboard.py          # Dashboard metrics endpoint
│   │   ├── health.py             # Health check endpoint
│   │   ├── history.py            # Prediction history endpoint
│   │   └── predict.py            # Prediction endpoint
│   ├── services/
│   │   ├── prediction_service.py # Prediction business logic
│   │   └── supabase_service.py   # Supabase integration service
│   ├── tests/                    # Backend test suite
│   ├── utils/
│   │   ├── logger.py             # Logging configuration
│   │   └── validator.py          # Input validation utilities
│   ├── .env.example              # Environment variable template
│   ├── app.py                    # Flask application entry point
│   ├── config.py                 # Application configuration
│   ├── Procfile                  # Gunicorn process file
│   ├── render.yaml               # Render deployment config
│   └── requirements.txt          # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardCard.jsx   # Dashboard metric card
│   │   │   ├── HistoryTable.jsx    # Prediction history table
│   │   │   ├── LoadingSpinner.jsx  # Loading state indicator
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── PredictionForm.jsx  # Employee data input form
│   │   │   └── ResultCard.jsx      # Prediction result display
│   │   ├── context/                # React context providers
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── pages/
│   │   │   ├── About.jsx           # About page
│   │   │   ├── Dashboard.jsx       # Dashboard page
│   │   │   ├── History.jsx         # Prediction history page
│   │   │   └── Home.jsx            # Home / prediction page
│   │   ├── services/               # API service layer
│   │   ├── utils/                  # Frontend utilities
│   │   ├── App.jsx                 # Root application component
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # Application entry point
│   ├── index.html                  # HTML template
│   ├── package.json                # Node.js dependencies
│   ├── vercel.json                 # Vercel deployment config
│   └── vite.config.js              # Vite build configuration
│
├── ml-training/
│   ├── dataset.csv                 # Training dataset
│   ├── evaluate.py                 # Model evaluation script
│   ├── preprocess_data.py          # Data preprocessing script
│   ├── train.py                    # Model training script
│   └── train_model.ipynb           # Jupyter notebook for training
│
├── docs/
│   ├── api_documentation.md        # API reference docs
│   ├── architecture.md             # Architecture documentation
│   └── deployment.md               # Deployment guide
│
├── .gitignore
├── LICENSE                         # MIT License
├── package.json                    # Root package (build scripts)
├── render.yaml                     # Render deployment config
├── vercel.json                     # Vercel deployment config
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+ and **npm** 9+
- **Supabase** account (for database persistence — optional for local development)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS / Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your Supabase credentials:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_anon_key_here
   ```

5. **Run the development server:**
   ```bash
   python app.py
   ```
   The backend API will be available at `http://localhost:5000`.

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the API endpoint:**

   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

---

## 📡 API Reference

All endpoints are served from the Flask backend.

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "employee-attrition-backend",
  "supabase_connected": true
}
```

---

### `POST /api/predict`
Submit employee data and receive an attrition risk prediction.

**Request Body:**
| Field                        | Type     | Default                  | Description                        |
|------------------------------|----------|--------------------------|------------------------------------|
| `employee_name`              | string   | `"Employee"`             | Name of the employee               |
| `age`                        | integer  | `35`                     | Employee age                       |
| `monthly_income`             | float    | `5000`                   | Monthly income                     |
| `overtime`                   | string   | `"No"`                   | Works overtime (`"Yes"` / `"No"`)  |
| `job_satisfaction`           | integer  | `3`                      | Satisfaction rating (1–4)          |
| `work_life_balance`          | integer  | `3`                      | Work-life balance score (1–4)      |
| `years_at_company`           | integer  | `5`                      | Tenure in years                    |
| `years_since_last_promotion` | integer  | `1`                      | Years since last promotion         |
| `distance_from_home`         | integer  | `10`                     | Commute distance in km             |
| `environment_satisfaction`   | integer  | `3`                      | Environment satisfaction (1–4)     |
| `department`                 | string   | `"Research & Development"`| Department name                   |
| `job_role`                   | string   | `"Software Engineer"`    | Job role title                     |

**Response:**
```json
{
  "employee_name": "Sarah Jenkins",
  "department": "Research & Development",
  "job_role": "Research Scientist",
  "risk_score": 0.78,
  "risk_percentage": "78%",
  "risk_level": "High Risk",
  "top_factors": [
    "Mandatory / Frequent Overtime",
    "Low Job Satisfaction rating"
  ],
  "recommendations": [
    "Schedule a 1-on-1 career progression review immediately.",
    "Review workload and mitigate overtime demands.",
    "Conduct a compensation benchmark for market adjustment."
  ],
  "timestamp": "Just now"
}
```

---

### `GET /api/dashboard`
Retrieve organization-wide attrition metrics and department breakdowns.

**Response:**
```json
{
  "overall_attrition_rate": "16.1%",
  "total_employees_analyzed": 1470,
  "high_risk_count": 237,
  "medium_risk_count": 412,
  "low_risk_count": 821,
  "top_attrition_drivers": [...],
  "department_breakdown": [...]
}
```

---

### `GET /api/history`
Fetch the most recent prediction history (up to 20 entries).

**Response:** Array of prediction objects (same shape as `/api/predict` response).

---

## 🤖 ML Model

### Training Pipeline

The `ml-training/` directory contains the full model training pipeline:

| File                  | Purpose                                           |
|-----------------------|---------------------------------------------------|
| `dataset.csv`         | IBM HR Analytics Employee Attrition dataset       |
| `preprocess_data.py`  | Data cleaning, encoding, and feature engineering  |
| `train.py`            | Model training script (ANN architecture)          |
| `evaluate.py`         | Model evaluation and performance metrics          |
| `train_model.ipynb`   | Interactive Jupyter notebook for experimentation  |

### Saved Model Artifacts

Pre-trained model artifacts are stored in `backend/models/`:

- **`ann_model.h5`** — Trained Artificial Neural Network weights
- **`scaler.pkl`** — StandardScaler fitted on training data
- **`label_encoder.pkl`** — LabelEncoder for categorical features
- **`feature_columns.pkl`** — Ordered feature column names

### Risk Scoring Logic

The prediction engine evaluates multiple factors with weighted scoring:

| Factor                        | Risk Contribution |
|-------------------------------|-------------------|
| Overtime (Yes)                | +0.25             |
| Monthly Income < $3,500       | +0.20             |
| Low Job Satisfaction (≤ 2)    | +0.18             |
| Poor Work-Life Balance (≤ 2)  | +0.15             |
| No Promotion (4+ years)       | +0.12             |
| Low Environment Satisfaction  | +0.10             |
| Long Commute (> 20 km)        | +0.08             |
| High Job Satisfaction (= 4)   | −0.08             |
| High Work-Life Balance (= 4)  | −0.08             |
| High Income (> $10,000)       | −0.10             |

---

## ☁️ Deployment

### Frontend → Vercel

The frontend is configured for zero-config deployment on **Vercel**:

1. Connect your GitHub repository to Vercel.
2. Vercel auto-detects the `vercel.json` configuration:
   - **Build command:** `cd frontend && npm install && npm run build`
   - **Output directory:** `frontend/dist`
   - SPA routing is handled via rewrites.
3. Set the `VITE_API_URL` environment variable to your Render backend URL.

### Backend → Render

The backend is configured for deployment on **Render**:

1. Connect your GitHub repository to Render.
2. Render uses the `render.yaml` blueprint:
   - **Runtime:** Python
   - **Build:** `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start:** `gunicorn app:app`
   - **Health check:** `/health`
3. Set the required environment variables (`SUPABASE_URL`, `SUPABASE_KEY`).

### CI/CD

GitHub Actions workflows are located in `.github/workflows/`:
- **`backend.yml`** — Backend CI pipeline
- **`frontend.yml`** — Frontend CI pipeline

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable        | Required | Description                              |
|-----------------|----------|------------------------------------------|
| `PORT`          | No       | Server port (default: `5000`)            |
| `SUPABASE_URL`  | Yes      | Your Supabase project URL                |
| `SUPABASE_KEY`  | Yes      | Your Supabase anonymous/public API key   |

### Frontend (`frontend/.env`)

| Variable        | Required | Description                              |
|-----------------|----------|------------------------------------------|
| `VITE_API_URL`  | Yes      | Backend API base URL                     |

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** the repository.
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
]]>
