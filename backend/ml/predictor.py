"""
predictor.py

Employee Attrition Prediction - Backend Machine Learning Layer

This module implements a Stacking Ensemble Classifier that combines:
1. Random Forest (scikit-learn)
2. LightGBM (lightgbm)
3. Artificial Neural Network (TensorFlow/Keras)

A Logistic Regression model acts as the "meta-learner" to combine the base
predictions into a single, high-accuracy probability of employee attrition.

This code is written to be simple and easy to understand for beginners.
"""

import os
import joblib
import numpy as np
import tensorflow as tf
from ml.preprocessing import preprocess_data
from ml.utils import format_response

# Resolve the models directory relative to this file's location.
# This ensures it works on any system without path configuration issues.
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
MODELS_DIR = os.path.join(BACKEND_DIR, "models")

# Global variables to cache the loaded models in memory (lazy loading)
_preprocessor = None
_rf_model = None
_lgbm_model = None
_ann_model = None
_meta_learner = None
_is_loaded = False


def load_models():
    """
    Loads the preprocessor and all machine learning models from the models directory.
    We load these models ONLY ONCE on the first prediction request to optimize performance.
    """
    global _preprocessor, _rf_model, _lgbm_model, _ann_model, _meta_learner, _is_loaded

    # If already loaded, skip loading again
    if _is_loaded:
        return

    print("\n--- Loading Machine Learning Models & Preprocessor ---")

    # 1. Load the Preprocessor (scales numerical features, encodes categories)
    preprocessor_path = os.path.join(MODELS_DIR, "preprocessor.pkl")
    if not os.path.exists(preprocessor_path):
        raise FileNotFoundError(
            f"Preprocessor artifact not found at: {preprocessor_path}\n"
            "Please copy the preprocessor.pkl file into the backend/models directory."
        )
    print(f"Loading Preprocessor from: {preprocessor_path}")
    _preprocessor = joblib.load(preprocessor_path)

    # 2. Load the Random Forest Base Model
    rf_path = os.path.join(MODELS_DIR, "final_rf.pkl")
    if not os.path.exists(rf_path):
        raise FileNotFoundError(f"Random Forest model not found at: {rf_path}")
    print(f"Loading Random Forest Model from: {rf_path}")
    _rf_model = joblib.load(rf_path)

    # 3. Load the LightGBM Base Model
    lgbm_path = os.path.join(MODELS_DIR, "final_lgbm.pkl")
    if not os.path.exists(lgbm_path):
        raise FileNotFoundError(f"LightGBM model not found at: {lgbm_path}")
    print(f"Loading LightGBM Model from: {lgbm_path}")
    _lgbm_model = joblib.load(lgbm_path)

    # 4. Load the Artificial Neural Network (ANN) Base Model
    ann_path = os.path.join(MODELS_DIR, "final_ann.h5")
    if not os.path.exists(ann_path):
        raise FileNotFoundError(f"ANN model not found at: {ann_path}")
    print(f"Loading Neural Network Model from: {ann_path}")
    _ann_model = tf.keras.models.load_model(ann_path)

    # 5. Load the Meta-Learner (Logistic Regression)
    meta_path = os.path.join(MODELS_DIR, "meta_learner.pkl")
    if not os.path.exists(meta_path):
        raise FileNotFoundError(f"Meta-learner model not found at: {meta_path}")
    print(f"Loading Meta-Learner Model from: {meta_path}")
    _meta_learner = joblib.load(meta_path)

    _is_loaded = True
    print("--- All Models and Preprocessor Loaded Successfully! ---\n")


def predict_attrition(employee_data_dict):
    """
    Takes a dictionary of employee features and returns their attrition prediction.

    Parameters:
        employee_data_dict (dict): Raw features of a single employee. E.g.:
                                   {"Age": 35, "Department": "Sales", ...}

    Returns:
        dict: A dictionary containing the stacked ensemble prediction,
              overall probability, and predictions from individual base models.
    """
    # Ensure all models are loaded in memory
    load_models()

    # 1. Preprocess the features (apply scaling and encoding)
    processed_x = preprocess_data(employee_data_dict, _preprocessor)

    # 2. Generate probabilities from each base model
    # predict_proba returns [prob_class_0, prob_class_1]. We extract prob_class_1.
    rf_prob = float(_rf_model.predict_proba(processed_x)[0, 1])
    lgbm_prob = float(_lgbm_model.predict_proba(processed_x)[0, 1])
    
    # ANN returns a 2D prediction matrix [[prob]], extract the scalar value
    ann_prob = float(_ann_model.predict(processed_x, verbose=0)[0, 0])

    # 3. Stack the base model predictions to create the input for the Meta-Learner
    stacked_features = np.column_stack([rf_prob, lgbm_prob, ann_prob])

    # 4. Get the final ensemble probability using the Meta-Learner (Logistic Regression)
    final_prob = float(_meta_learner.predict_proba(stacked_features)[0, 1])

    # 5. Determine final classification label based on a 50% probability threshold
    prediction_label = "Yes" if final_prob >= 0.5 else "No"

    # 6. Format and return structured results
    return format_response(prediction_label, final_prob, rf_prob, lgbm_prob, ann_prob)
