import os
from dotenv import load_dotenv

# Explicitly load the local backend .env file
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
DATABASE_URL = os.getenv("SUPABASE_DATABASE_URL") or os.getenv("DATABASE_URL") or "postgresql://postgres:Abhinav%402(764%25@db.wvmdwwknwopknrwydiem.supabase.co:5432/postgres"
