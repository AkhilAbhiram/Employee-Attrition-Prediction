from flask import Blueprint, jsonify

bp = Blueprint("predict", __name__)

@bp.route("/predict", methods=["POST"])
def predict():
    return jsonify({"message": "Prediction endpoint placeholder"})
