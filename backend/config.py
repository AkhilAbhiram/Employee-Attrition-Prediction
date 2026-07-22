import os

class Config:
    SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://isgyotofnsmldgqdziui.supabase.co")
    SUPABASE_KEY = os.environ.get("SUPABASE_KEY", os.environ.get("SUPABASE_ANON_KEY", ""))
    PORT = int(os.environ.get("PORT", 5000))
