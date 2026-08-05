# 🚀 Employee Attrition Prediction System - Complete Step-by-Step Walkthrough

This document provides a comprehensive, step-by-step walkthrough of the entire project, explaining the architecture, dataset, data preprocessing, machine learning model, backend API, Supabase database integration, and frontend React application.

---

## 📌 Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Data Acquisition & Exploratory Data Analysis (EDA)](#2-data-acquisition--exploratory-data-analysis-eda)
3. [Data Preprocessing Pipeline](#3-data-preprocessing-pipeline)
4. [Machine Learning Model (Stacking Ensemble)](#4-machine-learning-model-stacking-ensemble)
5. [Flask Backend API & Supabase Integration](#5-flask-backend-api--supabase-integration)
6. [React Frontend UI & Pages](#6-react-frontend-ui--pages)
7. [Step-by-Step Setup and Execution Guide](#7-step-by-step-setup-and-execution-guide)

---

## 1. System Architecture Overview

The system is designed as a modular monorepo containing three primary layers:
- **`ml-training/` (Machine Learning Layer)**: Handles historical data loading, cleaning, pipeline building, ensemble model training, and exporting trained artifacts.
- **`backend/` (Web API Backend)**: Flask web server that handles API endpoints, schema validation, database persistence (linked to Supabase PostgreSQL), and runs live model inference using cached models.
- **`frontend/` (Web UI Frontend)**: React application built with Vite, utilizing Tailwind CSS/Vanilla CSS, Axios, and React Router to provide an interactive form, real-time results, history logs, and analytical dashboards.

```
                  ┌──────────────────────┐
                  │     React Frontend   │
                  │  (User Inputs Form)  │
                  └──────────┬───────────┘
                             │ (POST /predict)
                             ▼
                  ┌──────────────────────┐
                  │    Flask Backend     │
                  │   (Validates Data)   │
                  └──────────┬───────────┘
                             │ (Runs Preprocessing & ML Models)
                             ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                        Inference Layer                       │
  │  Base Models: [Random Forest] [LightGBM] [Neural Net (ANN)]  │
  │                      ─── stacked into ───                    │
  │              Meta-Learner: [Logistic Regression]             │
  └──────────────────────────┬───────────────────────────────────┘
                             │ (Returns result & saves data)
                             ▼
                  ┌──────────────────────┐
                  │   Supabase Postgres  │
                  │ (Database Storage)   │
                  └──────────────────────┘
```

---

## 2. Data Acquisition & Exploratory Data Analysis (EDA)
**Location:** [dataset.csv](file:///d:/Employee_Attrition_Prediction_System/ml-training/dataset.csv), [train_model.ipynb](file:///d:/Employee_Attrition_Prediction_System/ml-training/train_model.ipynb)

The system is trained on the IBM HR Analytics Attrition Dataset. It contains information about employees, including:
- **Personal Details**: `Age`, `Gender`, `MaritalStatus`, `Education`, `EducationField`.
- **Work/Tenure Details**: `Department`, `JobRole`, `JobLevel`, `TotalWorkingYears`, `YearsAtCompany`, `YearsInCurrentRole`, `YearsSinceLastPromotion`, `YearsWithCurrManager`.
- **Financial/Reward Metrics**: `MonthlyIncome`, `DailyRate`, `HourlyRate`, `MonthlyRate`, `PercentSalaryHike`, `StockOptionLevel`.
- **Feedback/Satisfaction Scores**: `EnvironmentSatisfaction`, `JobInvolvement`, `JobSatisfaction`, `RelationshipSatisfaction`, `PerformanceRating`, `WorkLifeBalance`.
- **Binary Flag features**: `BusinessTravel`, `OverTime`.

### EDA Findings:
1. **Class Imbalance**: Approximately 84% of employees in the dataset stay, while 16% leave. To prevent the models from ignoring the minority class, class weighting and stratified splits are utilized.
2. **Key Predictors**:
   - **Overtime**: Employees working overtime exhibit a significantly higher rate of attrition.
   - **Monthly Income & Job Level**: Lower monthly incomes and entry-level positions correlate with higher turnover.
   - **Years At Company**: Higher turnover is observed during the first 1-2 years of tenure.

---

## 3. Data Preprocessing Pipeline
**Location:** [preprocess_data.py](file:///d:/Employee_Attrition_Prediction_System/ml-training/preprocess_data.py)

Before data is passed to the machine learning models, it goes through a Scikit-Learn `ColumnTransformer` pipeline:
1. **Feature Dropping**: Irrelevant or constant features are removed:
   - `EmployeeCount` (always 1)
   - `EmployeeNumber` (unique identifier)
   - `Over18` (always 'Y')
   - `StandardHours` (always 80)
2. **Imputation**: Handles missing values:
   - Numerical fields use `SimpleImputer(strategy='median')`.
   - Categorical fields use `SimpleImputer(strategy='most_frequent')`.
3. **Encoding & Scaling**:
   - Numerical features are normalized using `StandardScaler` to have a mean of 0 and variance of 1.
   - Categorical features are converted into numeric vectors using `OneHotEncoder(handle_unknown='ignore')`.
4. **Stratified Split**: The dataset is split into **80% training** and **20% testing** sets, stratified on the target `Attrition` column to maintain the 84/16 class balance across both sets.
5. **Artifact Generation**: The fitted preprocessor is saved as `preprocessor.pkl` to scale new live inputs on the backend exactly as it scaled training data.

---

## 4. Machine Learning Model (Stacking Ensemble)
**Location:** [train.py](file:///d:/Employee_Attrition_Prediction_System/ml-training/train.py)

To achieve high predictive performance, the system uses a **Stacking Ensemble Classifier**:

### **A. Base Models**
1. **Random Forest Classifier**: An ensemble of 300 decision trees. Handled with balanced class weights to penalize errors on minority class predictions.
2. **LightGBM Classifier**: A gradient boosting framework using leaf-wise tree growth. It is highly optimized for tabular datasets.
3. **Artificial Neural Network (ANN)**: A Multi-Layer Perceptron (MLP) built with TensorFlow/Keras:
   - Input layer matched to the preprocessed feature count.
   - Hidden Layer 1: 64 neurons, ReLU activation, Batch Normalization, and 30% Dropout.
   - Hidden Layer 2: 32 neurons, ReLU activation, and 20% Dropout.
   - Hidden Layer 3: 16 neurons, ReLU activation.
   - Output Layer: 1 neuron, Sigmoid activation (outputs an attrition probability between 0 and 1).

### **B. Stacking Process**
- **5-Fold Stratified Cross-Validation**:
  - The training dataset is split into 5 folds.
  - Base models are trained on 4 folds and predict on the 5th fold (Out-of-Fold, OOF predictions).
  - This is repeated so every training sample gets an OOF prediction from all 3 base models without data leakage.
- **Meta-Learner**:
  - A `LogisticRegression` model is trained. Its inputs (features) are the OOF prediction probabilities from the three base models, and its target is the actual `Attrition` label.
  - The Meta-Learner learns how to weigh and combine the outputs of the three base models.
- **Production Refit**:
  - All three base models are refit on the *entire* training dataset, and along with the meta-learner, are saved to the backend models directory.

---

## 5. Flask Backend API & Supabase Integration
**Location:** [backend/](file:///d:/Employee_Attrition_Prediction_System/backend)

The backend provides the API service layer for running inference, saving history, and pulling dashboard analytics.

### **Database Layer (Supabase Integration)**
The application connects to **Supabase (PostgreSQL)**. To handle differences between SQLite and PostgreSQL, a custom database driver wrapper was built in [db.py](file:///d:/Employee_Attrition_Prediction_System/backend/database/db.py):
- **Postgres Lowercase Folding**: PostgreSQL automatically converts unquoted table and column names to lowercase. To prevent this from breaking python code (e.g. looking for `row["Department"]` when Postgres returns `row["department"]`), we implemented a custom `RowWrapper` class.
- `RowWrapper` maps lowercase column descriptions case-insensitively, meaning `row["Department"]` and `row["department"]` both succeed.
- **Index-based Access**: Standard Postgres dictionaries don't support indices, which crashes aggregate count queries like `cursor.fetchone()[0]`. `RowWrapper` implements index-based access (`__getitem__`), allowing both count queries and column-name maps to run flawlessly.
- **Database Initialization**: On application start, `init_db()` executes table creation scripts on Supabase to ensure `employees` and `predictions` tables exist.

### **API Endpoints**
- **`GET /api/health`**: Verifies backend server health.
- **`POST /api/predict`**: Accepts a JSON body of 30 employee features, preprocesses them, feeds them into the Stacking Ensemble model, inserts raw features and predictions into Supabase, and returns the result.
- **`GET /api/history`**: Retrieves prediction history, joining the `predictions` and `employees` tables.
- **`GET /api/dashboard`**: Returns summary metrics (total predictions, attrition rates, and distribution of attrition grouped by Department, Overtime, and Job Role) to populate the frontend graphs.

---

## 6. React Frontend UI & Pages
**Location:** [frontend/src/](file:///d:/Employee_Attrition_Prediction_System/frontend/src)

The frontend is a single-page React app serving four pages:
1. **Home (`pages/Home.jsx`)**: Displays the main prediction form. Users fill in a 30-field questionnaire containing numerical and categorical features of an employee. Submitting the form shows a detailed prediction card with the Stacking Ensemble result and individual model probabilities.
2. **Dashboard (`pages/Dashboard.jsx`)**: Displays attrition analytics. Pulls aggregate stats from the backend and plots them in interactive charts, showing turnover rates based on Department, Job Role, and Overtime.
3. **History (`pages/History.jsx`)**: Shows a log table of all predictions. Users can review past submissions, details, and predicted outcomes.
4. **About (`pages/About.jsx`)**: Explains the purpose of the application, the neural network structure, and the Stacking Ensemble technique.

---

## 7. Step-by-Step Setup and Execution Guide

### **Step A: Environment Setup**
1. **Clone the Project**:
   ```bash
   git clone <repo_url>
   cd Employee_Attrition_Prediction_System
   ```
2. **Configure Supabase Credentials**:
   In [backend/.env](file:///d:/Employee_Attrition_Prediction_System/backend/.env), set your Supabase database connection string:
   ```env
   SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   FLASK_ENV=development
   ```

### **Step B: Backend Server Execution**
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   - **Windows**: `EmployeeAttrition\Scripts\activate` (or your Python 3.12 environment)
   - **Mac/Linux**: `source EmployeeAttrition/bin/activate`
3. Run the Flask application:
   ```bash
   python app.py
   ```
   *The database schema will automatically initialize on your Supabase Postgres instance on start.*

### **Step C: Frontend UI Execution**
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173/` in your browser to interact with the application.

### **Step D: Running Unit Tests**
To verify the database layer and prediction pipelines locally without hitting Supabase, run pytest:
```bash
& "C:\Program Files\Python312\python.exe" -m pytest
```
*(Tests will automatically bypass Supabase and run against a temporary in-memory SQLite database, verifying all CRUD operations and wrappers pass).*
