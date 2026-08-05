"""
predict.py

Route blueprint for running model inference (employee attrition prediction).
"""

from flask import Blueprint, jsonify, request
from services import prediction_service
from utils.logger import logger

bp = Blueprint("predict", __name__)


@bp.route("/predict", methods=["POST"])
def predict():
    """
    POST /api/predict
    Expects a JSON body with 30 employee features.
    Saves details and generates prediction with probabilities.
    """
    # 1. Fetch JSON data from request body
    data = request.get_json() or {}
    
    try:
        logger.info("Received prediction request...")
        
        # 2. Call the prediction service
        result = prediction_service.make_prediction(data)
        
        logger.info(f"Prediction successful. Result: {result['prediction']} (Prob: {result['probability']})")
        
        # 3. Return prediction result
        return jsonify(result), 200
        
    except ValueError as val_err:
        logger.warning(f"Validation failed: {str(val_err)}")
        return jsonify({"error": str(val_err)}), 400
        
    except Exception as e:
        logger.error(f"Prediction failed with server error: {str(e)}")
        return jsonify({"error": "An internal server error occurred while making the prediction."}), 500
