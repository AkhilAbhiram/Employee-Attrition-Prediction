"""
validator.py

Utility module for validating incoming employee feature payloads.

Ensures that:
1. All 30 required fields are present in the request dictionary.
2. No required fields are null.

Written to be simple and easy to understand for beginners.
"""

# The list of 30 feature names expected by the trained ML pipeline
REQUIRED_FEATURES = [
    "Age",
    "BusinessTravel",
    "DailyRate",
    "Department",
    "DistanceFromHome",
    "Education",
    "EducationField",
    "EnvironmentSatisfaction",
    "Gender",
    "HourlyRate",
    "JobInvolvement",
    "JobLevel",
    "JobRole",
    "JobSatisfaction",
    "MaritalStatus",
    "MonthlyIncome",
    "MonthlyRate",
    "NumCompaniesWorked",
    "OverTime",
    "PercentSalaryHike",
    "PerformanceRating",
    "RelationshipSatisfaction",
    "StockOptionLevel",
    "TotalWorkingYears",
    "TrainingTimesLastYear",
    "WorkLifeBalance",
    "YearsAtCompany",
    "YearsInCurrentRole",
    "YearsSinceLastPromotion",
    "YearsWithCurrManager"
]


def validate_employee_data(employee_data_dict):
    """
    Validates the incoming employee payload.

    Parameters:
        employee_data_dict (dict): Dictionary from JSON request.

    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    """
    # 1. Ensure the payload is a dictionary
    if not isinstance(employee_data_dict, dict):
        return False, "Request payload must be a JSON object."

    # 2. Check for missing or null fields
    for feature in REQUIRED_FEATURES:
        if feature not in employee_data_dict:
            return False, f"Missing required field: '{feature}'"
        
        if employee_data_dict[feature] is None:
            return False, f"Field '{feature}' cannot be null"

    # If all checks pass
    return True, None
