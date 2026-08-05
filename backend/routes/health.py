"""
health.py

Health check endpoint blueprint. Used to verify backend service status.
"""

from flask import Blueprint, jsonify

# Create a blueprint for health endpoint
bp = Blueprint("health", __name__)


@bp.route("/health", methods=["GET"])
def health():
    """
    GET /api/health
    Returns service health status.
    """
    return jsonify({
        "status": "healthy",
        "message": "Employee Attrition Prediction System API is running."
    }), 200
