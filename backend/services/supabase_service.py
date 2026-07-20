"""
supabase_service.py

Service layer module for Supabase / Postgres integration.

This module provides:
- is_supabase_active()      : Check whether a Supabase URL is configured.
- check_supabase_connection(): Verify the Supabase/Postgres connection is reachable.
- sync_to_supabase()        : Log and pass-through prediction results (data is always
                              saved via db.py; this module adds observability on top).

Architecture note:
  The actual database writes (INSERT / SELECT) always go through database/db.py,
  which automatically routes to Supabase/Postgres when SUPABASE_DATABASE_URL is set,
  or falls back to local SQLite for development. This module handles the
  Supabase-specific housekeeping that sits above the raw DB layer.
"""

import os
from utils.logger import logger


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def is_supabase_active():
    """
    Returns True if a Supabase/Postgres connection URL is configured via
    the SUPABASE_DATABASE_URL (or DATABASE_URL) environment variable.

    When False, the app is running in local SQLite mode (development).
    """
    url = os.getenv("SUPABASE_DATABASE_URL") or os.getenv("DATABASE_URL") or ""
    return url.startswith(("postgres://", "postgresql://"))


def check_supabase_connection():
    """
    Attempts to open a real database connection and run a lightweight
    query to verify Supabase / Postgres is reachable.

    Returns:
        dict: {
            "connected"  : bool   - True if the connection succeeded.
            "mode"       : str    - "supabase" or "sqlite".
            "message"    : str    - Human-readable status description.
        }
    """
    if not is_supabase_active():
        return {
            "connected": True,
            "mode": "sqlite",
            "message": "Running in local development mode (SQLite). "
                       "Set SUPABASE_DATABASE_URL to use Supabase."
        }

    try:
        from database.db import get_connection
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        conn.close()

        logger.info("Supabase connection check passed.")
        return {
            "connected": True,
            "mode": "supabase",
            "message": "Supabase (Postgres) connection is healthy."
        }

    except Exception as exc:
        logger.error("Supabase connection check failed: %s", exc)
        return {
            "connected": False,
            "mode": "supabase",
            "message": f"Supabase connection failed: {str(exc)}"
        }


# ---------------------------------------------------------------------------
# Main public function
# ---------------------------------------------------------------------------

def sync_to_supabase(prediction_result):
    """
    Called after every successful prediction to log the storage destination
    and return the result unchanged.

    In production (SUPABASE_DATABASE_URL is set), data has already been
    persisted to Supabase/Postgres by prediction_service.py via database/db.py.
    This function adds a log entry confirming that and passes the result through.

    In local development (SQLite), it logs that the result was stored locally.

    Parameters:
        prediction_result (dict): The structured prediction output from predictor.py.
                                  E.g.:
                                  {
                                      "prediction"      : "Yes",
                                      "probability"     : 0.87,
                                      "base_predictions": { ... }
                                  }

    Returns:
        dict: The same prediction_result dict, unchanged.
    """
    if is_supabase_active():
        logger.info(
            "Prediction synced to Supabase. "
            "Label=%s | Probability=%.4f | "
            "RF=%.4f | LGBM=%.4f | ANN=%.4f",
            prediction_result.get("prediction"),
            prediction_result.get("probability", 0),
            prediction_result.get("base_predictions", {}).get("random_forest", 0),
            prediction_result.get("base_predictions", {}).get("lightgbm", 0),
            prediction_result.get("base_predictions", {}).get("neural_network", 0),
        )
    else:
        logger.info(
            "Prediction stored in local SQLite database. "
            "Label=%s | Probability=%.4f",
            prediction_result.get("prediction"),
            prediction_result.get("probability", 0),
        )

    # Pass the result through so callers can chain this function if needed
    return prediction_result
