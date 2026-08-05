"""
test_database.py

Unit tests for SQLite database operations.
Verifies table creation, employee insertion, and prediction results insertion.
"""

import os
import sys
import pytest
import sqlite3
import importlib

# Ensure backend directory is in the path
TEST_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(TEST_DIR)
sys.path.append(BACKEND_DIR)

from database.db import get_connection, init_db
from database.employee import insert_employee, get_employee
from database.prediction import insert_prediction, get_prediction_history, get_dashboard_stats

# Use a test database file for testing
TEST_DB_FILE = "test_employee_attrition.db"


@pytest.fixture(autouse=True)
def setup_test_db(monkeypatch):
    """
    Fixture to automatically configure the database path to a separate test file,
    initialize the tables before each test, and clean up the file afterward.
    """
    # Clear any database URL from environment to force SQLite fallback during tests
    monkeypatch.delenv("SUPABASE_DATABASE_URL", raising=False)
    monkeypatch.delenv("DATABASE_URL", raising=False)

    # Monkeypatch the database file path to use the test database
    import database.db
    monkeypatch.setattr(database.db, "DATABASE_FILE", TEST_DB_FILE)
    
    # Initialize the test database
    init_db()
    
    yield
    
    # Clean up the test database file
    if os.path.exists(TEST_DB_FILE):
        try:
            os.remove(TEST_DB_FILE)
        except PermissionError:
            pass  # Ignore if file is temporarily locked by sqlite


def test_supabase_connection_string_is_honored(monkeypatch):
    """The database layer should prefer a Supabase/Postgres connection string when provided."""
    monkeypatch.setenv("SUPABASE_DATABASE_URL", "postgresql://user:pass@localhost:5432/attrition")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///fallback.db")

    import database.db
    database.db = importlib.reload(database.db)

    assert database.db.get_database_url() == "postgresql://user:pass@localhost:5432/attrition"


def test_employee_insertion():
    """
    Tests that an employee's features can be inserted and retrieved correctly.
    """
    conn = get_connection()
    mock_employee = {
        "Age": 30,
        "BusinessTravel": "Travel_Rarely",
        "DailyRate": 800,
        "Department": "Research & Development",
        "DistanceFromHome": 5,
        "Education": 3,
        "EducationField": "Medical",
        "EnvironmentSatisfaction": 4,
        "Gender": "Male",
        "HourlyRate": 60,
        "JobInvolvement": 2,
        "JobLevel": 1,
        "JobRole": "Laboratory Technician",
        "JobSatisfaction": 3,
        "MaritalStatus": "Married",
        "MonthlyIncome": 3000,
        "MonthlyRate": 10000,
        "NumCompaniesWorked": 1,
        "OverTime": "No",
        "PercentSalaryHike": 15,
        "PerformanceRating": 3,
        "RelationshipSatisfaction": 3,
        "StockOptionLevel": 1,
        "TotalWorkingYears": 5,
        "TrainingTimesLastYear": 3,
        "WorkLifeBalance": 3,
        "YearsAtCompany": 5,
        "YearsInCurrentRole": 2,
        "YearsSinceLastPromotion": 1,
        "YearsWithCurrManager": 2
    }
    
    # Insert employee
    emp_id = insert_employee(conn, mock_employee)
    assert emp_id > 0
    
    # Retrieve employee
    retrieved = get_employee(conn, emp_id)
    assert retrieved is not None
    assert retrieved["Age"] == 30
    assert retrieved["Department"] == "Research & Development"
    assert retrieved["Gender"] == "Male"
    
    conn.close()


def test_prediction_insertion_and_dashboard():
    """
    Tests that prediction results can be saved and retrieved in the history and dashboard stats.
    """
    conn = get_connection()
    mock_employee = {
        "Age": 28, "BusinessTravel": "Non-Travel", "DailyRate": 600, "Department": "Sales",
        "DistanceFromHome": 10, "Education": 4, "EducationField": "Marketing", "EnvironmentSatisfaction": 1,
        "Gender": "Female", "HourlyRate": 70, "JobInvolvement": 3, "JobLevel": 2, "JobRole": "Sales Executive",
        "JobSatisfaction": 2, "MaritalStatus": "Single", "MonthlyIncome": 5000, "MonthlyRate": 12000,
        "NumCompaniesWorked": 2, "OverTime": "Yes", "PercentSalaryHike": 12, "PerformanceRating": 3,
        "RelationshipSatisfaction": 2, "StockOptionLevel": 0, "TotalWorkingYears": 6, "TrainingTimesLastYear": 2,
        "WorkLifeBalance": 2, "YearsAtCompany": 4, "YearsInCurrentRole": 3, "YearsSinceLastPromotion": 0,
        "YearsWithCurrManager": 3
    }
    
    # Insert employee
    emp_id = insert_employee(conn, mock_employee)
    
    # Mock prediction result
    mock_result = {
        "prediction": "Yes",
        "probability": 0.75,
        "base_predictions": {
            "random_forest": 0.65,
            "lightgbm": 0.80,
            "neural_network": 0.78
        }
    }
    
    # Save prediction
    insert_prediction(conn, emp_id, mock_result)
    
    # Check history
    history = get_prediction_history(conn)
    assert len(history) == 1
    assert history[0]["prediction_label"] == "Yes"
    assert history[0]["probability"] == 0.75
    assert history[0]["rf_probability"] == 0.65
    assert history[0]["Department"] == "Sales"
    
    # Check dashboard stats
    stats = get_dashboard_stats(conn)
    assert stats["total_predictions"] == 1
    assert stats["attrition_rate"] == 100.0
    assert len(stats["attrition_by_department"]) == 1
    assert stats["attrition_by_department"][0]["department"] == "Sales"
    assert stats["attrition_by_department"][0]["rate"] == 100.0
    
    conn.close()
