"""
utils.py

Employee Attrition Prediction - Backend Machine Learning Layer
This module contains utility helper functions, including response formatting for predictions.
"""

def format_response(prediction_label, final_prob, rf_prob, lgbm_prob, ann_prob):
    """
    Formats the final predictions and individual base model probabilities into a structured dictionary.

    Parameters:
        prediction_label (str): "Yes" or "No" prediction.
        final_prob (float): Final stacked ensemble probability.
        rf_prob (float): Random Forest prediction probability.
        lgbm_prob (float): LightGBM prediction probability.
        ann_prob (float): Neural Network prediction probability.

    Returns:
        dict: Structured dictionary matching the API response schema.
    """
    return {
        "prediction": prediction_label,
        "probability": round(final_prob, 4),
        "base_predictions": {
            "random_forest": round(rf_prob, 4),
            "lightgbm": round(lgbm_prob, 4),
            "neural_network": round(ann_prob, 4)
        }
    }
