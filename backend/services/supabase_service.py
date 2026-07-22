import os
import logging
from config import Config

logger = logging.getLogger(__name__)

supabase_client = None

try:
    if Config.SUPABASE_URL and Config.SUPABASE_KEY:
        from supabase import create_client, Client
        supabase_client: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
        logger.info("Supabase client initialized successfully.")
    else:
        logger.warning("SUPABASE_KEY is missing. Supabase integration operating in fallback mode.")
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {e}")
    supabase_client = None


def save_prediction_to_supabase(prediction_data):
    """
    Persist prediction result into Supabase 'predictions' table.
    """
    if not supabase_client:
        logger.warning("Supabase client not connected. Skipping database write.")
        return False

    try:
        data = {
            "employee_name": prediction_data.get("employee_name"),
            "department": prediction_data.get("department"),
            "job_role": prediction_data.get("job_role"),
            "risk_score": float(prediction_data.get("risk_score", 0.0)),
            "risk_percentage": prediction_data.get("risk_percentage"),
            "risk_level": prediction_data.get("risk_level"),
            "top_factors": prediction_data.get("top_factors", []),
            "recommendations": prediction_data.get("recommendations", [])
        }
        res = supabase_client.table("predictions").insert(data).execute()
        return res
    except Exception as e:
        logger.error(f"Error inserting prediction to Supabase: {e}")
        return False


def fetch_history_from_supabase(limit=20):
    """
    Retrieve latest prediction history from Supabase 'predictions' table.
    """
    if not supabase_client:
        return None

    try:
        res = supabase_client.table("predictions").select("*").order("created_at", desc=True).limit(limit).execute()
        return res.data
    except Exception as e:
        logger.error(f"Error querying prediction history from Supabase: {e}")
        return None
