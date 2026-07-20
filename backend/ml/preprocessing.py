"""
preprocessing.py

Employee Attrition Prediction - Backend Machine Learning Layer
This module handles real-time preprocessing of raw employee features using the preprocessor pipeline.
"""

import pandas as pd

def preprocess_data(employee_data_dict, preprocessor):
    """
    Preprocesses the raw employee features (dict) using the saved scikit-learn preprocessor.
    Converts to a 1-row DataFrame, transforms it, and returns a dense array.

    Parameters:
        employee_data_dict (dict): Raw features of a single employee.
        preprocessor (ColumnTransformer): The loaded preprocessor pipeline.

    Returns:
        numpy.ndarray: Preprocessed feature array.
    """
    # 1. Convert raw input dict to a 1-row Pandas DataFrame
    raw_df = pd.DataFrame([employee_data_dict])

    # 2. Preprocess the features (apply scaling and encoding)
    processed_x = preprocessor.transform(raw_df)

    # Keras/LightGBM require a dense array format
    if hasattr(processed_x, "toarray"):
        processed_x = processed_x.toarray()

    return processed_x
