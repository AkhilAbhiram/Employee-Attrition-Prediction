"""
prediction_service.py

Service layer module containing the core business logic of the application.

Functions:
- make_prediction(employee_data_dict): Validates data, runs prediction, saves to DB.
- fetch_history(limit): Retrieves past prediction history.
- fetch_dashboard_stats(): Retrieves aggregated analytics for the dashboard.

Written to be simple and easy to understand for beginners.
"""

from database.db import get_connection
from database.employee import insert_employee
from database.prediction import insert_prediction, get_prediction_history, get_dashboard_stats
from ml.predictor import predict_attrition
from utils.validator import validate_employee_data


def make_prediction(employee_data_dict):
    """
    Coordinates the process of:
    1. Validating the incoming employee features.
    2. Saving the raw features into the database.
    3. Generating predictions from the Stacking Ensemble ML model.
    4. Saving the prediction results linked to the employee record.
    5. Returning the final structured prediction result.
    """
    # 1. Validate the input fields
    is_valid, error_msg = validate_employee_data(employee_data_dict)
    if not is_valid:
        raise ValueError(error_msg)

    # Establish database connection
    conn = get_connection()
    try:
        # 2. Insert raw employee details to get an employee_id
        employee_id = insert_employee(conn, employee_data_dict)
        
        # 3. Make predictions using the Stacking Ensemble
        prediction_result = predict_attrition(employee_data_dict)
        
        # 4. Insert prediction details, linking back to the employee_id
        insert_prediction(conn, employee_id, prediction_result)
        
        # Add employee_id to response for frontend reference
        result_response = prediction_result.copy()
        result_response["employee_id"] = employee_id
        
        return result_response
        
    except Exception as e:
        # Rollback database transaction on error
        conn.rollback()
        raise e
    finally:
        # Ensure connection is closed to prevent database locks
        conn.close()


def fetch_history(limit=100):
    """
    Retrieves recent predictions joined with employee features from the database.
    """
    conn = get_connection()
    try:
        history = get_prediction_history(conn, limit)
        return history
    finally:
        conn.close()


def fetch_dashboard_stats():
    """
    Retrieves summary analytics for the dashboard page.
    """
    conn = get_connection()
    try:
        stats = get_dashboard_stats(conn)
        return stats
    finally:
        conn.close()
