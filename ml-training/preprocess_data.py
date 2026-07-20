"""
preprocessing.py

Employee Attrition Prediction

This module performs:

1. Dataset Loading
2. Data Cleaning
3. Feature Selection
4. Column Identification
5. Preprocessing Pipeline
6. Train/Test Split
7. Save Preprocessor
"""

import os
import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from sklearn.impute import SimpleImputer
from sklearn.preprocessing import (
    StandardScaler,
    OneHotEncoder,
    LabelEncoder
)

from sklearn.model_selection import train_test_split


class DataPreprocessor:

    TARGET_COLUMN = "Attrition"

    DROP_COLUMNS = [
        "EmployeeCount",
        "EmployeeNumber",
        "Over18",
        "StandardHours"
    ]

    def __init__(self, dataset_path):

        self.dataset_path = dataset_path

        self.df = None

        self.preprocessor = None

        self.target_encoder = LabelEncoder()

        self.feature_names = []

        os.makedirs("artifacts", exist_ok=True)

    # ----------------------------------------------------------

    def load_dataset(self):

        print("\nLoading Dataset...")

        self.df = pd.read_csv(self.dataset_path)

        print("Dataset Loaded Successfully")

        print("Shape :", self.df.shape)

    # ----------------------------------------------------------

    def clean_dataset(self):

        print("\nCleaning Dataset...")

        existing = [
            col
            for col in self.DROP_COLUMNS
            if col in self.df.columns
        ]

        self.df.drop(columns=existing, inplace=True)

        self.df.drop_duplicates(inplace=True)

        self.df.reset_index(drop=True, inplace=True)

        print("Dataset Cleaned")

        print("New Shape :", self.df.shape)

    # ----------------------------------------------------------

    def split_features_target(self):

        X = self.df.drop(columns=[self.TARGET_COLUMN])

        y = self.df[self.TARGET_COLUMN]

        y = self.target_encoder.fit_transform(y)

        return X, y

    # ----------------------------------------------------------

    def identify_columns(self, X):

        numerical_columns = X.select_dtypes(
            include=["int64", "float64"]
        ).columns.tolist()

        categorical_columns = X.select_dtypes(
            include=["object"]
        ).columns.tolist()

        print("\nNumerical Features :", len(numerical_columns))

        print("Categorical Features :", len(categorical_columns))

        return numerical_columns, categorical_columns

    # ----------------------------------------------------------

    def build_pipeline(
        self,
        numerical_columns,
        categorical_columns
    ):

        numeric_pipeline = Pipeline(

            steps=[

                (
                    "imputer",
                    SimpleImputer(strategy="median")
                ),

                (
                    "scaler",
                    StandardScaler()
                )

            ]

        )

        categorical_pipeline = Pipeline(

            steps=[

                (
                    "imputer",
                    SimpleImputer(strategy="most_frequent")
                ),

                (
                    "encoder",
                    OneHotEncoder(
                        handle_unknown="ignore"
                    )
                )

            ]

        )

        self.preprocessor = ColumnTransformer(

            transformers=[

                (
                    "num",
                    numeric_pipeline,
                    numerical_columns
                ),

                (
                    "cat",
                    categorical_pipeline,
                    categorical_columns
                )

            ]

        )

    # ----------------------------------------------------------

    def preprocess(self):

        X, y = self.split_features_target()

        numerical_columns, categorical_columns = self.identify_columns(X)

        self.build_pipeline(

            numerical_columns,

            categorical_columns

        )

        X_processed = self.preprocessor.fit_transform(X)

        self.feature_names = self.preprocessor.get_feature_names_out()

        return train_test_split(

            X_processed,

            y,

            test_size=0.20,

            random_state=42,

            stratify=y

        )

    # ----------------------------------------------------------

    def save_artifacts(self):

        print("\nSaving Artifacts...")

        joblib.dump(

            self.preprocessor,

            "artifacts/preprocessor.pkl"

        )

        joblib.dump(

            self.target_encoder,

            "artifacts/target_encoder.pkl"

        )

        joblib.dump(

            self.feature_names,

            "artifacts/feature_names.pkl"

        )

        print("Artifacts Saved Successfully")

    # ----------------------------------------------------------

    def process(self):

        self.load_dataset()

        self.clean_dataset()

        X_train, X_test, y_train, y_test = self.preprocess()

        self.save_artifacts()

        print("\nPreprocessing Completed Successfully")

        print("----------------------------------------")

        print("Training Samples :", X_train.shape)

        print("Testing Samples  :", X_test.shape)

        print("Processed Features :", X_train.shape[1])

        print("----------------------------------------")

        return (

            X_train,

            X_test,

            y_train,

            y_test

        )


# --------------------------------------------------------------

if __name__ == "__main__":

    processor = DataPreprocessor(

        "D:\Employee_Attrition_Prediction_System\ml-training\dataset.csv"

    )

    X_train, X_test, y_train, y_test = processor.process()