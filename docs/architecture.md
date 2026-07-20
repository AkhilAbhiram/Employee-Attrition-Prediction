# 📐 System Architecture

This project is built using a decoupled **three-tier architecture** featuring a decoupled React frontend, a Flask API backend, and an Out-of-Fold Stacking Ensemble Machine Learning classifier.

---

## 1. Monorepo Structure

- **`frontend/` (React + Vite)**: Exposes the User Interface. Employs React Router for navigation, Context API for state management, and Axios to interact with the backend API.
- **`backend/` (Flask API Server)**: Processes HTTP requests, performs schema validation, coordinates the ML prediction pipeline, and manages persistence via PostgreSQL/Supabase.
- **`ml-training/` (Scikit-Learn & TensorFlow)**: Dedicated offline environment containing the training dataset, preprocessing script, and model-building Jupyter notebook.

---

## 2. Main Components Flow

```
   [ React Frontend (Vite) ]
               │
               │ (HTTP POST /api/predict)
               ▼
     [ Flask API (app.py) ]
               │
      ┌────────┴────────┐
      ▼                 ▼
[ Preprocessor ]  [ Database Wrapper ] (db.py)
  (transform)           │
      │                 ▼
      │        [ Supabase Postgres ]
      ▼
[ Base ML Models ] ──► [ Meta-Learner ] ──► [ JSON Result ] ──► (React UI)
(RF, LGBM, ANN)       (Logistic Reg)
```

For a comprehensive step-by-step description of each component, please refer to the main walkthrough:
👉 **[project_walkthrough.md](file:///d:/Employee_Attrition_Prediction_System/docs/project_walkthrough.md)**
