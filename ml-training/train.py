"""
train.py

Employee Attrition Prediction - Stacking Ensemble Model Training Script

This script performs the full model training process:
1. Loads dataset.csv and runs the DataPreprocessor.
2. Defines base learners: Random Forest, LightGBM, and an Artificial Neural Network (ANN).
3. Performs 5-Fold Stratified Stacking to generate Out-Of-Fold (OOF) predictions.
4. Trains a Logistic Regression meta-learner on the stacked predictions.
5. Refits all base models on the full training set.
6. Saves the preprocessor and all models directly to the backend/models directory.

Written to be simple and easy to understand for beginners.
"""

import os
import sys
import json
import joblib
import shutil
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.model_selection import StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from lightgbm import LGBMClassifier

# Set random seed for reproducibility
RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)
tf.random.set_seed(RANDOM_STATE)

# Paths configuration
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(CURRENT_DIR, "dataset.csv")
BACKEND_MODELS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "../backend/models"))

# Import the DataPreprocessor from preprocess_data.py
sys.path.append(CURRENT_DIR)
from preprocess_data import DataPreprocessor


def build_ann(input_dim):
    """
    Builds and compiles an Artificial Neural Network (ANN) using Keras.
    """
    model = tf.keras.models.Sequential([
        # Input layer and first hidden layer with 64 units and ReLU activation
        tf.keras.layers.Dense(64, activation="relu", kernel_initializer=tf.keras.initializers.HeNormal(), input_shape=(input_dim,)),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.3),  # Helps prevent overfitting
        
        # Second hidden layer with 32 units
        tf.keras.layers.Dense(32, activation="relu", kernel_initializer=tf.keras.initializers.HeNormal()),
        tf.keras.layers.Dropout(0.2),
        
        # Third hidden layer with 16 units
        tf.keras.layers.Dense(16, activation="relu", kernel_initializer=tf.keras.initializers.HeNormal()),
        
        # Output layer with 1 unit and Sigmoid activation (for binary probability)
        tf.keras.layers.Dense(1, activation="sigmoid", kernel_initializer=tf.keras.initializers.GlorotUniform())
    ])
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss="binary_crossentropy",
        metrics=["accuracy", tf.keras.metrics.AUC(name="auc")]
    )
    return model


def main():
    print("====================================================")
    print("      Starting Stacking Ensemble Model Training     ")
    print("====================================================")
    
    # Ensure backend models directory exists
    os.makedirs(BACKEND_MODELS_DIR, exist_ok=True)
    
    # 1. Load and Preprocess Data
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}. Please place dataset.csv here.")
        
    processor = DataPreprocessor(DATASET_PATH)
    X_train, X_test, y_train, y_test = processor.process()
    
    # Ensure data is in dense format
    if hasattr(X_train, "toarray"):
        X_train = X_train.toarray()
    if hasattr(X_test, "toarray"):
        X_test = X_test.toarray()
        
    y_train = np.asarray(y_train)
    y_test = np.asarray(y_test)
    
    print(f"\nTraining set shape: {X_train.shape}")
    print(f"Testing set shape:  {X_test.shape}")
    
    # 2. Compute class weights to handle imbalance
    neg, pos = np.bincount(y_train)
    total = neg + pos
    class_weight_dict = {
        0: total / (2 * neg),
        1: total / (2 * pos)
    }
    scale_pos_weight = neg / pos
    print(f"\nClass imbalance ratio: {scale_pos_weight:.2f} (Negative/Positive)")
    
    # 3. Initialize Base Models
    rf_model = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_leaf=2,
        class_weight=class_weight_dict,
        random_state=RANDOM_STATE,
        n_jobs=-1
    )
    
    lgbm_model = LGBMClassifier(
        n_estimators=400,
        learning_rate=0.03,
        num_leaves=31,
        scale_pos_weight=scale_pos_weight,
        random_state=RANDOM_STATE,
        n_jobs=-1,
        verbosity=-1
    )
    
    # 4. Out-Of-Fold (OOF) Stacking to train the Meta-Learner
    print("\n--- Performing 5-Fold Stratified Stacking ---")
    n_splits = 5
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=RANDOM_STATE)
    
    # Arrays to hold OOF predictions (used as training features for meta-learner)
    oof_rf = np.zeros(X_train.shape[0])
    oof_lgbm = np.zeros(X_train.shape[0])
    oof_ann = np.zeros(X_train.shape[0])
    
    # Arrays to hold test set predictions from each fold (averaged later)
    test_rf_folds = np.zeros((n_splits, X_test.shape[0]))
    test_lgbm_folds = np.zeros((n_splits, X_test.shape[0]))
    test_ann_folds = np.zeros((n_splits, X_test.shape[0]))
    
    fold = 0
    for train_idx, val_idx in skf.split(X_train, y_train):
        print(f"Training Stacking Fold {fold + 1}/{n_splits}...")
        X_tr, X_val = X_train[train_idx], X_train[val_idx]
        y_tr, y_val = y_train[train_idx], y_train[val_idx]
        
        # A. Random Forest
        fold_rf = RandomForestClassifier(
            n_estimators=100, max_depth=10, class_weight=class_weight_dict, random_state=RANDOM_STATE, n_jobs=-1
        )
        fold_rf.fit(X_tr, y_tr)
        oof_rf[val_idx] = fold_rf.predict_proba(X_val)[:, 1]
        test_rf_folds[fold] = fold_rf.predict_proba(X_test)[:, 1]
        
        # B. LightGBM
        fold_lgbm = LGBMClassifier(
            n_estimators=100, learning_rate=0.05, scale_pos_weight=scale_pos_weight, random_state=RANDOM_STATE, n_jobs=-1, verbosity=-1
        )
        fold_lgbm.fit(X_tr, y_tr)
        oof_lgbm[val_idx] = fold_lgbm.predict_proba(X_val)[:, 1]
        test_lgbm_folds[fold] = fold_lgbm.predict_proba(X_test)[:, 1]
        
        # C. ANN
        fold_ann = build_ann(X_train.shape[1])
        callbacks = [
            tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
            tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3)
        ]
        fold_ann.fit(
            X_tr, y_tr,
            validation_data=(X_val, y_val),
            epochs=50,
            batch_size=32,
            class_weight=class_weight_dict,
            callbacks=callbacks,
            verbose=0
        )
        oof_ann[val_idx] = fold_ann.predict(X_val, verbose=0).ravel()
        test_ann_folds[fold] = fold_ann.predict(X_test, verbose=0).ravel()
        
        fold += 1
        
    # Combine OOF predictions into stacked feature matrix Z_train
    Z_train = np.column_stack([oof_rf, oof_lgbm, oof_ann])
    
    # Combine test predictions (average across all folds)
    Z_test = np.column_stack([
        test_rf_folds.mean(axis=0),
        test_lgbm_folds.mean(axis=0),
        test_ann_folds.mean(axis=0)
    ])
    
    # 5. Train the Meta-Learner (Logistic Regression) on stacked OOF predictions
    print("\nTraining Meta-Learner (Logistic Regression) on Stacked Features...")
    meta_learner = LogisticRegression(random_state=RANDOM_STATE)
    meta_learner.fit(Z_train, y_train)
    
    # 6. Evaluate Stacking Ensemble Performance on Test Set
    meta_test_preds = meta_learner.predict(Z_test)
    meta_test_probs = meta_learner.predict_proba(Z_test)[:, 1]
    
    print("\n--- Out-of-Fold Stacking Test Performance ---")
    print(f"Accuracy : {accuracy_score(y_test, meta_test_preds):.4f}")
    print(f"Precision: {precision_score(y_test, meta_test_preds):.4f}")
    print(f"Recall   : {recall_score(y_test, meta_test_preds):.4f}")
    print(f"F1-Score : {f1_score(y_test, meta_test_preds):.4f}")
    print(f"ROC-AUC  : {roc_auc_score(y_test, meta_test_probs):.4f}")
    
    # 7. Refit base models on the FULL training set for production use
    print("\nRefitting final models on full training dataset...")
    
    print("Fitting final Random Forest...")
    rf_model.fit(X_train, y_train)
    
    print("Fitting final LightGBM...")
    lgbm_model.fit(X_train, y_train)
    
    print("Fitting final Neural Network (ANN)...")
    final_ann = build_ann(X_train.shape[1])
    # Train ANN on full training data with 10% validation split
    final_ann.fit(
        X_train, y_train,
        validation_split=0.1,
        epochs=40,
        batch_size=32,
        class_weight=class_weight_dict,
        verbose=0
    )
    
    # 8. Save all artifacts to backend/models directory
    print(f"\nSaving model files to: {BACKEND_MODELS_DIR}")
    
    joblib.dump(rf_model, os.path.join(BACKEND_MODELS_DIR, "final_rf.pkl"))
    joblib.dump(lgbm_model, os.path.join(BACKEND_MODELS_DIR, "final_lgbm.pkl"))
    final_ann.save(os.path.join(BACKEND_MODELS_DIR, "final_ann.h5"))
    joblib.dump(meta_learner, os.path.join(BACKEND_MODELS_DIR, "meta_learner.pkl"))
    
    # Save a metrics JSON file for reference
    metrics_records = [
        {
            "model": "Stacked Ensemble (meta-learner)",
            "accuracy": round(accuracy_score(y_test, meta_test_preds), 4),
            "precision": round(precision_score(y_test, meta_test_preds), 4),
            "recall": round(recall_score(y_test, meta_test_preds), 4),
            "f1": round(f1_score(y_test, meta_test_preds), 4),
            "roc_auc": round(roc_auc_score(y_test, meta_test_probs), 4)
        }
    ]
    with open(os.path.join(BACKEND_MODELS_DIR, "stacking_metrics.json"), "w") as f:
        json.dump(metrics_records, f, indent=2)
        
    # Copy preprocessor from artifacts/ to backend/models/
    shutil.copy(
        os.path.join(CURRENT_DIR, "artifacts/preprocessor.pkl"),
        os.path.join(BACKEND_MODELS_DIR, "preprocessor.pkl")
    )
    
    print("\nTraining completed and all artifacts exported successfully!")
    print("====================================================")


if __name__ == "__main__":
    main()
