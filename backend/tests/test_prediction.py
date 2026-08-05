"""
test_prediction.py

Unit tests for the validator and prediction service.
"""

import os
import sys
import pytest

# Ensure backend directory is in the path
TEST_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(TEST_DIR)
sys.path.append(BACKEND_DIR)

from utils.validator import validate_employee_data
from services import prediction_service

# Valid sample payload containing all 30 features
VALID_EMPLOYEE = {
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


def test_validator_valid_data():
    """
    Tests that a correct features dictionary passes validation.
    """
    is_valid, error = validate_employee_data(VALID_EMPLOYEE)
    assert is_valid is True
    assert error is None


def test_validator_missing_fields():
    """
    Tests that a dictionary with missing fields fails validation.
    """
    # Create copy and remove 'Age'
    invalid_data = VALID_EMPLOYEE.copy()
    invalid_data.pop("Age")
    
    is_valid, error = validate_employee_data(invalid_data)
    assert is_valid is False
    assert "Missing required field: 'Age'" in error


def test_validator_null_fields():
    """
    Tests that a dictionary with null values fails validation.
    """
    # Create copy and set 'Department' to None
    invalid_data = VALID_EMPLOYEE.copy()
    invalid_data["Department"] = None
    
    is_valid, error = validate_employee_data(invalid_data)
    assert is_valid is False
    assert "Field 'Department' cannot be null" in error


def test_prediction_service_validation():
    """
    Tests that the prediction service raises a ValueError when passed invalid data.
    """
    invalid_data = {}
    with pytest.raises(ValueError) as excinfo:
        prediction_service.make_prediction(invalid_data)
    
    assert "Missing required field:" in str(excinfo.value)
