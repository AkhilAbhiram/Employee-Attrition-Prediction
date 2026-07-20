"""
logger.py

Logging utility module for Flask backend.

Sets up a clean logging format for outputting info and error logs to the console.

Written to be simple and easy to understand for beginners.
"""

import logging
import sys

# Configure default logging format and levels
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Get the logger instance for use across backend modules
logger = logging.getLogger("EmployeeAttritionAPI")
