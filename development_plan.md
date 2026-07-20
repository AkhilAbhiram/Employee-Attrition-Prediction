# Employee Attrition Prediction — Phase-to-Phase Development Plan

> Based on the repository structure for `Employee_Attrition_Prediction` (Flask + React + ANN + PostgreSQL, free-tier deployment).
> Note: I could not fetch the live contents of the GitHub repo directly (GitHub blocks automated page access), so this plan is built from the file structure and architecture you provided. If any file already contains working code, treat the corresponding phase below as a review/completion step rather than a from-scratch build.

---

## Phase 0 — Project Setup & Environment

**Goal:** Empty scaffold becomes a working, version-controlled monorepo.

- Initialize repo structure exactly as laid out (`backend/`, `frontend/`, `ml-training/`, `docs/`, `.github/workflows/`)
- Create `.gitignore` (exclude `venv/`, `node_modules/`, `.env`, `*.h5`, `*.pkl`, `local.db`)
- Set up Python virtual environment for `backend/` and `ml-training/`
- Set up `frontend/` with Vite + React
- Add `README.md` with setup instructions
- Add `LICENSE`

**Exit criteria:** `pip install -r requirements.txt` and `npm install` both succeed with no code yet.

---

## Phase 1 — Data Acquisition & Exploratory Data Analysis

**Location:** `ml-training/dataset.csv`, `ml-training/preprocess_data.py`

- Source dataset (e.g., IBM HR Analytics Attrition dataset from Kaggle)
- Load into `train_model.ipynb`: check shape, dtypes, missing values, class balance
- Identify categorical vs numerical features
- Visualize attrition rate by department, overtime, income, tenure, etc.
- Document key findings in `docs/` (feeds into feature selection)

**Exit criteria:** Clear list of final feature columns and confirmation of class imbalance ratio (informs Phase 2's resampling decision).

---

## Phase 2 — Data Preprocessing Pipeline

**Location:** `ml-training/preprocess_data.py`

- Drop non-predictive columns (IDs, constant-value columns)
- Encode categoricals: `LabelEncoder` for binary, one-hot for multi-class
- Scale numerical features with `StandardScaler`
- Handle class imbalance: `class_weight` in Keras, or SMOTE on the training split only
- Train/validation/test split (e.g., 70/15/15), stratified on the target
- Persist encoders/scaler as `label_encoder.pkl`, `scaler.pkl`, `feature_columns.pkl`

**Exit criteria:** A `preprocess_data(df)` function returning `X_train, X_val, X_test, y_train, y_val, y_test` plus saved artifacts.

---

## Phase 3 — ANN Model Development

**Location:** `ml-training/train.py`, `train_model.ipynb`, `evaluate.py`

**Architecture:**

| Layer | Units | Activation | Initializer | Notes |
|---|---|---|---|---|
| Input | = number of features after encoding | — | — | |
| Dense (Hidden 1) | 64 | ReLU | He Normal | + BatchNorm + Dropout(0.3) |
| Dense (Hidden 2) | 32 | ReLU | He Normal | + Dropout(0.2) |
| Dense (Hidden 3) | 16 | ReLU | He Normal | optional, if underfitting isn't a risk |
| Output | 1 | Sigmoid | Glorot Uniform | binary probability |

- **Optimizer:** Adam, learning rate 0.001 (with `ReduceLROnPlateau`)
- **Loss:** Binary cross-entropy
- **Regularization:** Dropout + optional L2(0.001) on hidden layers, BatchNormalization after each Dense layer
- **Training config:** batch size 32, up to 100 epochs, `EarlyStopping(patience=10, restore_best_weights=True)`
- **Class imbalance handling:** `class_weight={0: w0, 1: w1}` computed from training distribution, or SMOTE beforehand
- **Metrics tracked:** accuracy, precision, recall, F1, ROC-AUC (accuracy alone is misleading on imbalanced attrition data)

Sample skeleton:
```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.initializers import HeNormal, GlorotUniform
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

model = Sequential([
    Dense(64, activation="relu", kernel_initializer=HeNormal(), input_shape=(n_features,)),
    BatchNormalization(),
    Dropout(0.3),
    Dense(32, activation="relu", kernel_initializer=HeNormal()),
    Dropout(0.2),
    Dense(16, activation="relu", kernel_initializer=HeNormal()),
    Dense(1, activation="sigmoid", kernel_initializer=GlorotUniform()),
])

model.compile(optimizer=Adam(learning_rate=0.001),
              loss="binary_crossentropy",
              metrics=["accuracy", "AUC", "Precision", "Recall"])

callbacks = [
    EarlyStopping(patience=10, restore_best_weights=True),
    ReduceLROnPlateau(factor=0.5, patience=5),
]

history = model.fit(X_train, y_train, validation_data=(X_val, y_val),
                     epochs=100, batch_size=32, class_weight=class_weights,
                     callbacks=callbacks)
```

- Export `model.h5` (or `.keras`) + `scaler.pkl` + `label_encoder.pkl` + `feature_columns.pkl` to `backend/models/`

**Exit criteria:** Model beats a simple baseline (e.g., logistic regression) on ROC-AUC and recall for the minority ("Yes" attrition) class; artifacts saved and loadable outside the notebook.

---

## Phase 4 — Backend API (Flask)

**Location:** `backend/`

1. **Config & app factory** (`app.py`, `config.py`) — env-based `DATABASE_URL`, CORS setup
2. **Database layer** (`database/db.py`, `database/employee.py`, `database/prediction.py`) — SQLAlchemy models, migrations folder for schema changes
3. **ML layer** (`ml/predictor.py`, `ml/preprocessing.py`, `ml/utils.py`) — load model + artifacts once at startup, expose `predict_attrition(input_dict)`
4. **Service layer** (`services/prediction_service.py`, `services/supabase_service.py`) — business logic between routes and ml/database (validation, saving records, formatting responses)
5. **Routes** (`routes/predict.py`, `routes/history.py`, `routes/dashboard.py`, `routes/health.py`) — thin controllers calling services
6. **Validation & logging** (`utils/validator.py`, `utils/logger.py`) — input schema validation, structured request/error logging
7. **Tests** (`tests/test_prediction.py`, `tests/test_database.py`) — unit tests for prediction correctness and DB writes, using pytest + SQLite in-memory DB

**Exit criteria:** `POST /api/predict`, `GET /api/history`, `GET /api/dashboard`, `GET /api/health` all work locally against SQLite, verified via Postman/pytest.

---

## Phase 5 — Frontend (React)

**Location:** `frontend/`

1. **Services** (`services/api.js`, `services/predictionService.js`) — Axios wrapper around the Flask API
2. **State management** (`context/PredictionContext.jsx`, `hooks/usePrediction.js`) — shared prediction/history state across pages
3. **Components** — `Navbar`, `PredictionForm`, `ResultCard`, `DashboardCard`, `HistoryTable`, `LoadingSpinner`
4. **Pages** — `Home` (form + result), `Dashboard` (aggregate stats/charts), `History` (past predictions table), `About`
5. **Routing** — React Router across the four pages
6. **Constants** (`utils/constants.js`) — feature options (job roles, departments, etc.) matching the model's expected categories

**Exit criteria:** Full flow works locally — fill form → see prediction → see it appear in history/dashboard — against the local Flask API.

---

## Phase 6 — Integration & End-to-End Testing

- Connect frontend to backend locally end-to-end (`VITE_API_URL=http://localhost:5000`)
- Validate that frontend form field names exactly match `feature_columns.pkl` order/encoding
- Add error handling: invalid input, backend down, model load failure
- Cross-browser check, basic responsive layout pass
- Load-test `/api/predict` with a handful of concurrent requests

**Exit criteria:** No mismatches between frontend payload shape and backend's expected feature schema; graceful error states on the UI.

---

## Phase 7 — CI/CD Setup

**Location:** `.github/workflows/backend.yml`, `.github/workflows/frontend.yml`

- Backend workflow: install deps, run `pytest tests/`, then trigger Render deploy hook on success
- Frontend workflow: install deps, `npm run build` as a safety-net check before Vercel/Netlify's own auto-deploy
- Store secrets (`RENDER_DEPLOY_HOOK`) in GitHub Actions secrets, never in code

**Exit criteria:** A push to `main` that touches `backend/` or `frontend/` triggers the matching workflow and passes.

---

## Phase 8 — Deployment

1. **Database:** Create free Postgres instance on Supabase → copy connection string
2. **Backend:** Deploy to Render.com (root dir `backend/`, build `pip install -r requirements.txt`, start `gunicorn app:app`), set `DATABASE_URL`
3. **Frontend:** Deploy to Vercel (root dir `frontend/`, framework preset Vite), set `VITE_API_URL` to the Render URL
4. Smoke-test the live app end-to-end
5. (Optional) Swap Render for an Oracle Cloud Free Tier VM + Docker Compose if you want an always-on instance instead of a sleeping free tier

**Exit criteria:** Live public URL where a real user can submit the form and get a prediction, with history/dashboard populated from Postgres.

---

## Phase 9 — Polish & Extensions (Optional)

- Add authentication (Flask-Login or JWT) for an HR login screen
- Add model versioning (store which model version produced each prediction)
- Add SHAP-based explainability to show which features drove a given prediction
- Add charts to the Dashboard page (attrition rate by department, trend over time)
- Add a `docs/api_documentation.md` (endpoint contracts) and `docs/deployment.md` (runbook)

---

## Suggested Timeline (solo, part-time pace)

| Phase | Focus | Rough duration |
|---|---|---|
| 0 | Setup | 0.5 day |
| 1–2 | Data + preprocessing | 2–3 days |
| 3 | ANN model | 2–4 days (incl. tuning) |
| 4 | Backend | 3–5 days |
| 5 | Frontend | 3–5 days |
| 6 | Integration | 1–2 days |
| 7 | CI/CD | 1 day |
| 8 | Deployment | 1 day |
| 9 | Polish | ongoing |
