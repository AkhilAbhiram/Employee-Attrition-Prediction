"""
app.py

Main Application Factory and Server Entrypoint.

This module initializes the Flask app, configures CORS, registers routes,
and triggers the SQLite database initialization on startup.

Written to be simple and easy to understand for beginners.
"""

from flask import Flask, jsonify
from flask_cors import CORS

from database.db import init_db
from routes import health, predict, history, dashboard
from utils.logger import logger


def create_app():
    """
    Application factory pattern. Creates and configures the Flask application.
    """
    app = Flask(__name__)

    # Enable Cross-Origin Resource Sharing (CORS)
    # This allows the React frontend (running on a different port) to access our endpoints.
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register Blueprints (groups of routes) under the /api prefix
    app.register_blueprint(health.bp, url_prefix="/api")
    app.register_blueprint(predict.bp, url_prefix="/api")
    app.register_blueprint(history.bp, url_prefix="/api")
    app.register_blueprint(dashboard.bp, url_prefix="/api")

    # Global Error Handlers for clean responses
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found."}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Internal server error."}), 500

    # Initialize the database (creates tables if they don't exist yet)
    try:
        init_db()
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")

    return app


# Create the app instance
app = create_app()

if __name__ == "__main__":
    logger.info("Starting Employee Attrition Prediction System API Server...")
    # Run the server locally on all interfaces at port 5000
    app.run(host="0.0.0.0", port=5000, debug=True)
