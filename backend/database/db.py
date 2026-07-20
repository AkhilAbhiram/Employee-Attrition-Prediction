"""
db.py

Database Layer Connection & Initializer.

This module supports either SQLite for local development or a Supabase/Postgres
connection string supplied through the environment variables.
"""

import os
import sqlite3
from urllib.parse import urlparse

from config import DATABASE_URL

# Define the local database filename
DATABASE_FILE = "employee_attrition.db"


class RowWrapper:
    """Wrapper that mimics sqlite3.Row for psycopg2 tuple-like outputs.
    Supports index-based access (row[0]) and case-insensitive key-based access (row['col']).
    """
    def __init__(self, row_data, description):
        self._row_data = row_data
        self._description = description
        # Map lowercase column names to their index
        self._col_to_idx = {desc[0].lower(): i for i, desc in enumerate(description)}
        self._col_names = [desc[0] for desc in description]

    def __getitem__(self, key):
        if isinstance(key, int):
            return self._row_data[key]
        if isinstance(key, str):
            idx = self._col_to_idx.get(key.lower())
            if idx is not None:
                return self._row_data[idx]
            raise KeyError(key)
        raise TypeError("Key must be int or str")

    def keys(self):
        return self._col_names

    def __iter__(self):
        return iter(self._row_data)

    def __len__(self):
        return len(self._row_data)


class CursorWrapper:
    """Wrap database cursors so the app can use the same SQL calls against SQLite and Postgres."""

    def __init__(self, cursor, dialect):
        self._cursor = cursor
        self.dialect = dialect

    def execute(self, query, params=None):
        if self.dialect == "postgresql" and params is not None:
            query = query.replace("?", "%s")
        self._cursor.execute(query, params or ())
        return self._cursor

    def fetchone(self):
        row = self._cursor.fetchone()
        if row is None:
            return None
        if self.dialect == "postgresql":
            return RowWrapper(row, self._cursor.description)
        return row

    def fetchall(self):
        rows = self._cursor.fetchall()
        if self.dialect == "postgresql":
            desc = self._cursor.description
            return [RowWrapper(row, desc) for row in rows]
        return rows

    @property
    def lastrowid(self):
        if self.dialect == "postgresql":
            self._cursor.execute("SELECT LASTVAL()")
            value = self._cursor.fetchone()
            return value[0] if value else None
        return self._cursor.lastrowid


class ConnectionWrapper:
    """Provide a uniform connection interface for the app code."""

    def __init__(self, connection, dialect):
        self._connection = connection
        self.dialect = dialect

    def cursor(self):
        return CursorWrapper(self._connection.cursor(), self.dialect)

    def commit(self):
        self._connection.commit()

    def rollback(self):
        self._connection.rollback()

    def close(self):
        self._connection.close()


def get_database_url():
    """Return the configured database URL, preferring Supabase/Postgres when provided."""
    return os.getenv("SUPABASE_DATABASE_URL") or os.getenv("DATABASE_URL") or DATABASE_URL


def is_postgres_url(url):
    parsed = urlparse(url or "")
    return parsed.scheme in {"postgres", "postgresql", "postgresql+psycopg2", "postgresql+psycopg2-binary"}


def get_connection():
    """Create a connection to SQLite or to a Supabase/Postgres database based on configuration."""
    db_url = get_database_url()

    if is_postgres_url(db_url):
        try:
            import psycopg2
        except ImportError as exc:
            raise RuntimeError("psycopg2 is required to connect to Supabase/Postgres") from exc
        connection = psycopg2.connect(db_url)
        return ConnectionWrapper(connection, "postgresql")

    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row
    return ConnectionWrapper(connection, "sqlite")


def init_db():
    """Initialize the required tables using the active database backend."""
    db_url = get_database_url()
    print(f"Initializing database using: {db_url}")
    conn = get_connection()
    cursor = conn.cursor()

    if is_postgres_url(db_url):
        employees_sql = """
        CREATE TABLE IF NOT EXISTS employees (
            id SERIAL PRIMARY KEY,
            Age INTEGER,
            BusinessTravel TEXT,
            DailyRate INTEGER,
            Department TEXT,
            DistanceFromHome INTEGER,
            Education INTEGER,
            EducationField TEXT,
            EnvironmentSatisfaction INTEGER,
            Gender TEXT,
            HourlyRate INTEGER,
            JobInvolvement INTEGER,
            JobLevel INTEGER,
            JobRole TEXT,
            JobSatisfaction INTEGER,
            MaritalStatus TEXT,
            MonthlyIncome INTEGER,
            MonthlyRate INTEGER,
            NumCompaniesWorked INTEGER,
            OverTime TEXT,
            PercentSalaryHike INTEGER,
            PerformanceRating INTEGER,
            RelationshipSatisfaction INTEGER,
            StockOptionLevel INTEGER,
            TotalWorkingYears INTEGER,
            TrainingTimesLastYear INTEGER,
            WorkLifeBalance INTEGER,
            YearsAtCompany INTEGER,
            YearsInCurrentRole INTEGER,
            YearsSinceLastPromotion INTEGER,
            YearsWithCurrManager INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        predictions_sql = """
        CREATE TABLE IF NOT EXISTS predictions (
            id SERIAL PRIMARY KEY,
            employee_id INTEGER,
            prediction_label TEXT,
            probability REAL,
            rf_probability REAL,
            lgbm_probability REAL,
            ann_probability REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
        );
        """
    else:
        employees_sql = """
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Age INTEGER,
            BusinessTravel TEXT,
            DailyRate INTEGER,
            Department TEXT,
            DistanceFromHome INTEGER,
            Education INTEGER,
            EducationField TEXT,
            EnvironmentSatisfaction INTEGER,
            Gender TEXT,
            HourlyRate INTEGER,
            JobInvolvement INTEGER,
            JobLevel INTEGER,
            JobRole TEXT,
            JobSatisfaction INTEGER,
            MaritalStatus TEXT,
            MonthlyIncome INTEGER,
            MonthlyRate INTEGER,
            NumCompaniesWorked INTEGER,
            OverTime TEXT,
            PercentSalaryHike INTEGER,
            PerformanceRating INTEGER,
            RelationshipSatisfaction INTEGER,
            StockOptionLevel INTEGER,
            TotalWorkingYears INTEGER,
            TrainingTimesLastYear INTEGER,
            WorkLifeBalance INTEGER,
            YearsAtCompany INTEGER,
            YearsInCurrentRole INTEGER,
            YearsSinceLastPromotion INTEGER,
            YearsWithCurrManager INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        predictions_sql = """
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER,
            prediction_label TEXT,
            probability REAL,
            rf_probability REAL,
            lgbm_probability REAL,
            ann_probability REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
        );
        """

    cursor.execute(employees_sql)
    cursor.execute(predictions_sql)

    conn.commit()
    conn.close()
    print("Database initialization complete.")
