# 🎯 Employee Attrition Prediction System

Welcome! This is a **full-stack machine learning application** that predicts whether an employee might leave a company. It combines:
- 🤖 **Machine Learning** (artificial neural networks) to make predictions
- 🌐 **Web Backend** (Flask API) to serve predictions
- 💻 **Web Frontend** (React) for an interactive user interface
- 📊 **Data Pipeline** for training and preprocessing

**What makes this project special?** It's designed to be **beginner-friendly** — you can explore how a real ML project comes together, from data to deployment!

---

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Key Components Explained](#key-components-explained)
- [Next Steps & Learning](#next-steps--learning)

---

## 🚀 Quick Start

### **5-Minute Overview**

This system works in three layers:

| Layer | Role | Technology |
|-------|------|-----------|
| **🤖 ML Layer** | Trains a model to predict attrition | Python, TensorFlow, Scikit-Learn |
| **🔌 Backend API** | Serves predictions via HTTP endpoints | Flask |
| **🎨 Frontend UI** | User interface to input data and see predictions | React + Vite |

**The flow:** User enters employee data → Backend sends it to ML model → Model predicts attrition risk → Frontend displays result

---

## 📂 Project Structure

Here's the complete layout (don't worry if this looks overwhelming at first!):

```
Employee_Attrition_Prediction_System/
├── README.md                    ← You are here!
├── development_plan.md          ← Detailed development phases
├── LICENSE                      ← Project license
│
├── 🤖 ML TRAINING (ml-training/)
│   ├── dataset.csv              ← Employee data used for training
│   ├── train_model.ipynb        ← Interactive notebook (Jupyter)
│   ├── train.py                 ← Script to train the model
│   ├── preprocess_data.py       ← Data cleaning & preparation
│   ├── evaluate.py              ← Model evaluation & metrics
│   └── artifacts/               ← Saved models & encoders
│
├── 🔌 BACKEND API (backend/)
│   ├── app.py                   ← Main Flask application
│   ├── config.py                ← Configuration settings
│   ├── requirements.txt          ← Python dependencies
│   │
│   ├── database/
│   │   ├── db.py                ← Database setup
│   │   ├── employee.py          ← Employee data model
│   │   └── prediction.py        ← Prediction history model
│   │
│   ├── ml/
│   │   ├── predictor.py         ← Loads & uses ML model
│   │   ├── preprocessing.py     ← Real-time data prep
│   │   └── utils.py             ← Helper functions
│   │
│   ├── routes/
│   │   ├── health.py            ← Health check endpoint
│   │   ├── predict.py           ← Main prediction endpoint
│   │   ├── history.py           ← Prediction history endpoint
│   │   └── dashboard.py         ← Dashboard stats endpoint
│   │
│   ├── services/
│   │   ├── prediction_service.py ← Prediction business logic
│   │   └── supabase_service.py  ← Database service
│   │
│   ├── tests/                   ← Unit tests
│   ├── utils/
│   │   ├── logger.py            ← Logging utility
│   │   └── validator.py         ← Input validation
│   │
│   ├── models/                  ← Trained ML models
│   │   ├── ann_model.h5         ← Neural network model
│   │   ├── final_ann.h5         ← Final model version
│   │   └── stacking_metrics.json ← Model performance data
│   │
│   └── EmployeeAttrition/       ← Python virtual environment
│
├── 💻 FRONTEND (frontend/)
│   ├── package.json             ← JavaScript dependencies
│   ├── vite.config.js           ← Build configuration
│   ├── index.html               ← Main HTML file
│   │
│   ├── src/
│   │   ├── main.jsx             ← App entry point
│   │   ├── App.jsx              ← Main app component
│   │   ├── index.css            ← Global styles
│   │   │
│   │   ├── components/          ← Reusable UI components
│   │   │   ├── Navbar.jsx       ← Navigation bar
│   │   │   ├── PredictionForm.jsx ← Form for user input
│   │   │   ├── ResultCard.jsx   ← Shows prediction results
│   │   │   ├── DashboardCard.jsx ← Dashboard statistics
│   │   │   ├── HistoryTable.jsx ← Prediction history
│   │   │   └── LoadingSpinner.jsx ← Loading indicator
│   │   │
│   │   ├── pages/               ← Full page components
│   │   │   ├── Home.jsx         ← Landing page
│   │   │   ├── Dashboard.jsx    ← Main dashboard
│   │   │   ├── History.jsx      ← Prediction history page
│   │   │   └── About.jsx        ← About page
│   │   │
│   │   ├── context/             ← Global state management
│   │   │   └── PredictionContext.jsx
│   │   │
│   │   ├── hooks/               ← Custom React hooks
│   │   │   └── usePrediction.js
│   │   │
│   │   ├── services/            ← API calls & utilities
│   │   │   ├── api.js           ← Axios setup & API calls
│   │   │   └── predictionService.js
│   │   │
│   │   └── utils/               ← Helper functions
│   │       └── constants.js     ← App constants
│   │
│   └── public/                  ← Static assets
│
├── 📖 DOCUMENTATION (docs/)
│   ├── architecture.md          ← System architecture overview
│   ├── api_documentation.md     ← API endpoint details
│   └── deployment.md            ← Deployment instructions
│
└── 📦 ARTIFACTS (artifacts/)    ← Generated outputs
```

---

## 🧠 How It Works

### **The Prediction Pipeline**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER PROVIDES DATA                                       │
│    (Age, salary, department, years worked, etc.)            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FRONTEND (React)                                         │
│    - Collects input from user                               │
│    - Validates the data                                     │
│    - Sends to Backend API                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. BACKEND API (Flask)                                      │
│    - Receives employee data                                 │
│    - Validates input                                        │
│    - Passes to ML pipeline                                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. ML PREPROCESSING                                         │
│    - Cleans the data                                        │
│    - Encodes categorical variables                          │
│    - Scales numerical features                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. ML MODEL (Neural Network)                                │
│    - Takes processed data                                   │
│    - Makes prediction (0-100% risk)                         │
│    - Returns confidence score                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. RESULT SENT BACK                                         │
│    - Backend returns prediction                             │
│    - Frontend displays with interpretation                  │
│    - History is saved to database                           │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Setup Instructions

### **Prerequisites**

Before you start, make sure you have these installed:

1. **Python 3.10+** → [Download here](https://www.python.org/downloads/)
2. **Node.js 18+** → [Download here](https://nodejs.org/)
3. **Git** → [Download here](https://git-scm.com/)
4. A **text editor** (VS Code recommended) → [Download here](https://code.visualstudio.com/)

### **Step 1: Clone or Download the Project**

```bash
# If using Git
git clone <your-repo-url>
cd Employee_Attrition_Prediction_System
```

### **Step 2: Set Up the Backend**

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
# On Windows:
python -m venv EmployeeAttrition
EmployeeAttrition\Scripts\activate

# On Mac/Linux:
python -m venv EmployeeAttrition
source EmployeeAttrition/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

**What's a virtual environment?** Think of it as a isolated workspace for Python packages. It keeps your project's dependencies separate from your system Python.

### **Step 3: Set Up the Frontend**

```bash
# Navigate to frontend directory
cd frontend

# Install JavaScript dependencies
npm install

# Check that it worked
npm --version
```

### **Step 4: Configure Environment Variables**

Create a `.env` file in the `backend/` directory:

```bash
# backend/.env
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///predictions.db
```

---

## 🎮 Running the Application

### **Terminal 1: Start the Backend API**

```bash
cd backend
source EmployeeAttrition/Scripts/activate  # (or .../bin/activate on Mac/Linux)
python app.py
```

You should see:
```
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
```

### **Terminal 2: Start the Frontend**

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v8.1.4  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

### **Open Your Browser**

Go to `http://localhost:5173/` and you should see the application!

---

## 🔍 Key Components Explained

### **1. ML Training (ml-training/)**

**What it does:** Trains the neural network to predict attrition

**Files:**
- `train_model.ipynb` - Interactive notebook for exploration (open in Jupyter)
- `train.py` - Script to train the model
- `preprocess_data.py` - Cleans and prepares raw data
- `dataset.csv` - Historical employee data

**How to retrain the model:**

```bash
cd ml-training
python train.py
```

**Pro tip:** Open `train_model.ipynb` in Jupyter to see step-by-step training with visualizations.

---

### **2. Backend API (backend/)**

**What it does:** Serves predictions via REST endpoints

**Key files:**
- `app.py` - Flask app factory and setup
- `routes/predict.py` - Main endpoint (`POST /api/predict`)
- `services/prediction_service.py` - Prediction logic
- `database/` - Data models and storage

**Main API Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Check if backend is running |
| `/api/predict` | POST | Make a prediction |
| `/api/history` | GET | Get past predictions |
| `/api/dashboard` | GET | Get statistics |

**Example prediction request:**

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "salary": 50000,
    "department": "Sales",
    "tenure": 5
  }'
```

---

### **3. Frontend (frontend/)**

**What it does:** Provides the user interface

**Key pages:**
- `Home.jsx` - Landing page
- `Dashboard.jsx` - Main interface with prediction form
- `History.jsx` - View past predictions
- `About.jsx` - Project information

**Key components:**
- `PredictionForm.jsx` - Form to input employee data
- `ResultCard.jsx` - Displays prediction result
- `HistoryTable.jsx` - Shows prediction history

**Technologies:**
- **React** - UI framework
- **Vite** - Fast build tool
- **Axios** - HTTP client for API calls
- **React Router** - Page navigation

---

### **4. Database**

The application uses **SQLite** (a lightweight database) to store:
- Prediction history
- Employee data
- Model performance metrics

Database files are stored in `backend/` and are automatically created on first run.

---

## 📚 Next Steps & Learning

### **For Beginners:**

1. **Explore the code:**
   - Read through `backend/routes/predict.py` to understand how predictions work
   - Check `frontend/components/PredictionForm.jsx` to see how forms work in React

2. **Run the ML training:**
   ```bash
   cd ml-training
   python train.py
   ```

3. **Test the API manually:**
   ```bash
   curl http://localhost:5000/api/health
   ```

4. **Modify and experiment:**
   - Try changing the neural network architecture in `ml-training/train.py`
   - Add new input fields to the prediction form
   - Create new dashboard visualizations

### **For Intermediate Learners:**

- [ ] Add database migrations in `backend/database/migrations/`
- [ ] Implement user authentication in the frontend
- [ ] Add more visualization charts to the dashboard
- [ ] Deploy to a cloud platform (Heroku, Vercel, Azure)
- [ ] Write unit tests in `backend/tests/`

### **For Advanced Learners:**

- [ ] Implement model versioning and A/B testing
- [ ] Add real-time model monitoring
- [ ] Create a CI/CD pipeline with GitHub Actions
- [ ] Implement advanced ML techniques (ensemble methods, hyperparameter tuning)
- [ ] Add API rate limiting and caching

---

## 📖 Additional Documentation

For more details, check these files:

- **Architecture Details:** See [docs/architecture.md](docs/architecture.md)
- **API Reference:** See [docs/api_documentation.md](docs/api_documentation.md)
- **Deployment Guide:** See [docs/deployment.md](docs/deployment.md)
- **Development Plan:** See [development_plan.md](development_plan.md)

---

## 🤝 Common Issues & Solutions

### **Backend won't start**

**Problem:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
# Make sure virtual environment is activated
cd backend
EmployeeAttrition\Scripts\activate  # Windows
source EnvironeeAttrition/bin/activate  # Mac/Linux

# Reinstall dependencies
pip install -r requirements.txt
```

### **Frontend won't load**

**Problem:** `EADDRINUSE: address already in use :::5173`

**Solution:**
```bash
# Kill the process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### **Predictions not working**

**Problem:** Model not found error

**Solution:**
```bash
# Retrain the model
cd ml-training
python train.py
```

---

## 💡 Tips for Success

✅ **Do:**
- Start with the frontend UI to understand what the system does
- Read the code comments (they explain the "why" not just the "what")
- Use VS Code with Python and JavaScript extensions for easier debugging
- Keep notes as you explore new concepts

❌ **Don't:**
- Try to understand everything at once — focus on one component at a time
- Skip the setup steps — they're crucial for everything to work
- Ignore error messages — read them carefully, they often tell you exactly what to fix

---

## 📞 Getting Help

If you get stuck:

1. **Read the error message carefully** - it usually tells you what's wrong
2. **Check the relevant documentation** in the `docs/` folder
3. **Look at the code comments** - they explain the reasoning
4. **Search online** - most errors are common and have solutions on Stack Overflow

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy exploring! 🚀** If you have questions or suggestions, feel free to open an issue or start a discussion.
