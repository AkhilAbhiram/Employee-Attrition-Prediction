"""
history.py

Route blueprint for retrieving prediction history.
"""

from flask import Blueprint, jsonify, request
from services import prediction_service
from utils.logger import logger

bp = Blueprint("history", __name__)


@bp.route("/history", methods=["GET"])
def history():
    """
    GET /api/history
    Optional Query Parameters:
      - limit: Maximum number of rows to retrieve (default: 100).
    Returns past prediction history.
    """
    limit = request.args.get("limit", default=100, type=int)
    
    try:
        logger.info(f"Fetching prediction history (limit={limit})...")
        history_list = prediction_service.fetch_history(limit)
        return jsonify(history_list), 200
        
    except Exception as e:
        logger.error(f"Failed to fetch history: {str(e)}")
        return jsonify({"error": "Failed to fetch prediction history."}), 500
