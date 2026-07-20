"""
evaluate.py

Employee Attrition Prediction - Stacking Ensemble Evaluation Script

This script evaluates the performance of our saved stacking ensemble models on the
test split of the dataset.

It performs:
1. Loads dataset.csv and runs DataPreprocessor (obtaining the test split).
2. Loads the preprocessor and all model artifacts from backend/models/.
3. Generates base model predictions and meta-learner prediction on test set.
4. Computes performance metrics: Accuracy, Precision, Recall, F1-Score, and ROC-AUC.
5. Displays a confusion matrix in a text-based format.

Written to be simple and easy to understand for beginners.
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

# Paths configuration
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(CURRENT_DIR, "dataset.csv")
BACKEND_MODELS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "../backend/models"))

# Import the DataPreprocessor from preprocess_data.py
sys.path.append(CURRENT_DIR)
from preprocess_data import DataPreprocessor


def print_confusion_matrix_readable(cm):
    """
    Prints a readable text-based confusion matrix representation.
    """
    print("\n--- Confusion Matrix ---")
    print("                  Predicted Stay (No)   Predicted Leave (Yes)")
    print(f"Actual Stay (No)          {cm[0, 0]:<21} {cm[0, 1]}")
    print(f"Actual Leave (Yes)        {cm[1, 0]:<21} {cm[1, 1]}")
    print("-------------------------")


def main():
    print("====================================================")
    print("     Evaluating Stacking Ensemble Model on Test Set ")
    print("====================================================")

    # 1. Load Preprocessor and Dataset Test Split
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}. Please place dataset.csv here.")
        
    processor = DataPreprocessor(DATASET_PATH)
    X_train, X_test, y_train, y_test = processor.process()
    
    # Ensure dense format
    if hasattr(X_test, "toarray"):
        X_test = X_test.toarray()
        
    y_test = np.asarray(y_test)
    
    # 2. Load all model files from backend/models/
    preprocessor_path = os.path.join(BACKEND_MODELS_DIR, "preprocessor.pkl")
    rf_path = os.path.join(BACKEND_MODELS_DIR, "final_rf.pkl")
    lgbm_path = os.path.join(BACKEND_MODELS_DIR, "final_lgbm.pkl")
    ann_path = os.path.join(BACKEND_MODELS_DIR, "final_ann.h5")
    meta_path = os.path.join(BACKEND_MODELS_DIR, "meta_learner.pkl")
    
    missing_files = [
        path for path in [preprocessor_path, rf_path, lgbm_path, ann_path, meta_path]
        if not os.path.exists(path)
    ]
    if missing_files:
        print("Error: The following model files are missing. Please run train.py first:")
        for path in missing_files:
            print(f"- {os.path.basename(path)}")
        sys.exit(1)
        
    print("\nLoading models and preprocessor...")
    preprocessor = joblib.load(preprocessor_path)
    final_rf = joblib.load(rf_path)
    final_lgbm = joblib.load(lgbm_path)
    final_ann = tf.keras.models.load_model(ann_path)
    meta_learner = joblib.load(meta_path)
    
    # 3. Generate base predictions
    print("Generating base model predictions...")
    p_rf = final_rf.predict_proba(X_test)[:, 1]
    p_lgbm = final_lgbm.predict_proba(X_test)[:, 1]
    p_ann = final_ann.predict(X_test, verbose=0).ravel()
    
    # Stack features
    Z_test = np.column_stack([p_rf, p_lgbm, p_ann])
    
    # 4. Generate meta-learner predictions
    print("Generating meta-learner predictions...")
    final_probs = meta_learner.predict_proba(Z_test)[:, 1]
    final_preds = meta_learner.predict(Z_test)
    
    # 5. Calculate and print metrics
    acc = accuracy_score(y_test, final_preds)
    prec = precision_score(y_test, final_preds)
    rec = recall_score(y_test, final_preds)
    f1 = f1_score(y_test, final_preds)
    auc = roc_auc_score(y_test, final_probs)
    
    print("\n================ EVALUATION METRICS ================")
    print(f"Accuracy : {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall   : {rec * 100:.2f}% (Rate of detecting actual attrition)")
    print(f"F1-Score : {f1 * 100:.2f}%")
    print(f"ROC-AUC  : {auc * 100:.2f}%")
    print("====================================================")
    
    # Print Confusion Matrix
    cm = confusion_matrix(y_test, final_preds)
    print_confusion_matrix_readable(cm)
    
    # Detailed classification report
    print("\n--- Detailed Classification Report ---")
    print(classification_report(y_test, final_preds, target_names=["Stay (No)", "Leave (Yes)"]))
    print("====================================================")


if __name__ == "__main__":
    main()
