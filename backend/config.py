import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Simple configuration class for the Flask app"""
    
    # Gemini API Configuration
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    
    # Flask Configuration
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    # CORS Configuration
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    
    @staticmethod
    def validate_config():
        """Validate that required configuration is present"""
        if not Config.GEMINI_API_KEY or Config.GEMINI_API_KEY == 'your_api_key_here':
            return False, "GEMINI_API_KEY not configured in .env file"
        return True, "Configuration is valid"
