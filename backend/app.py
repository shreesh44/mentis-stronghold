from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from gemini_service import GeminiChatService
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)

# Configure CORS - Simple setup for development
CORS(app, origins=[Config.FRONTEND_URL])

# Initialize Gemini service
gemini_service = None

def initialize_services():
    """Initialize services"""
    global gemini_service
    
    # Validate configuration
    is_valid, message = Config.validate_config()
    if not is_valid:
        logger.error(f"Configuration error: {message}")
        return
    
    # Initialize Gemini service
    try:
        gemini_service = GeminiChatService(Config.GEMINI_API_KEY)
        logger.info("Gemini service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini service: {e}")

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'MentiSphere Chat API',
        'gemini_ready': gemini_service is not None
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        # Check if Gemini service is available
        if gemini_service is None:
            return jsonify({
                'error': 'Chat service not available',
                'fallback_response': "I'm sorry, but I'm having trouble connecting right now. Please try again later."
            }), 503
        
        # Get user message from request
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message'].strip()
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Get response from Gemini
        ai_response = gemini_service.get_response(user_message)
        
        return jsonify({
            'response': ai_response,
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        
        # Return fallback response for errors
        fallback_responses = [
            "I understand you're reaching out for support. While I'm having technical difficulties, please know that your feelings are valid and you're not alone.",
            "I'm experiencing some technical issues right now, but I want you to know that seeking support shows strength. Please try again in a moment.",
            "I'm sorry, I'm having trouble responding right now. In the meantime, remember that it's okay to take things one step at a time."
        ]
        
        import random
        return jsonify({
            'response': random.choice(fallback_responses),
            'status': 'fallback',
            'error': 'Temporary service issue'
        }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Starting MentiSphere Chat API...")
    print(f"Frontend URL: {Config.FRONTEND_URL}")
    
    # Initialize services on startup
    initialize_services()
    
    app.run(debug=Config.DEBUG, port=5000, host='0.0.0.0')
