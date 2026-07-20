"""
dashboard.py

Route blueprint for retrieving aggregate dashboard analytics.
"""

from flask import Blueprint, jsonify
from services import prediction_service
from utils.logger import logger

bp = Blueprint("dashboard", __name__)


@bp.route("/dashboard", methods=["GET"])
def dashboard():
    """
    GET /api/dashboard
    Returns summary statistics and charts data (rate, counts, distribution of attrition).
    """
    try:
        logger.info("Fetching dashboard aggregate statistics...")
        stats = prediction_service.fetch_dashboard_stats()
        return jsonify(stats), 200
        
    except Exception as e:
        logger.error(f"Failed to fetch dashboard stats: {str(e)}")
        return jsonify({"error": "Failed to fetch dashboard statistics."}), 500
