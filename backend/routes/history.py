from flask import Blueprint, jsonify

bp = Blueprint("history", __name__)

@bp.route("/history", methods=["GET"])
def history():
    return jsonify({"history": []})
