import google.generativeai as genai
import logging
import time

logger = logging.getLogger(__name__)

class GeminiChatService:
    """Simple service to interact with Google Gemini API"""
    
    def __init__(self, api_key):
        """Initialize the Gemini service with API key"""
        try:
            # Configure Gemini API
            genai.configure(api_key=api_key)
            
            # Initialize the model - using gemini-pro for chat
            self.model = genai.GenerativeModel('gemini-pro')
            
            # Set up the context for mental health support
            self.system_context = """You are MentiSphere AI, a compassionate mental health support chatbot specifically designed for students. 

Your role:
- Provide empathetic, supportive responses to students' mental health concerns
- Offer practical coping strategies and techniques
- Be understanding of academic stress, social pressures, and student life challenges
- Always encourage professional help when needed
- Keep responses warm, non-judgmental, and encouraging
- Limit responses to 2-3 sentences to keep them concise and focused

Guidelines:
- Never provide medical advice or diagnose conditions
- Always validate the user's feelings
- Suggest healthy coping mechanisms when appropriate
- Be encouraging but realistic
- If someone expresses serious mental health crisis, gently suggest professional help

Remember: You're a supportive companion, not a replacement for professional therapy."""

            logger.info("Gemini service initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing Gemini service: {e}")
            raise

    def get_response(self, user_message):
        """Get a response from Gemini for the user's message"""
        try:
            # Create the prompt with context
            full_prompt = f"{self.system_context}\n\nStudent says: {user_message}\n\nYour supportive response:"
            
            # Add some basic rate limiting (simple approach)
            time.sleep(0.5)  # Small delay to be respectful to API
            
            # Generate response
            response = self.model.generate_content(full_prompt)
            
            # Extract the text response
            if response and response.text:
                ai_response = response.text.strip()
                logger.info(f"Generated response for user message (length: {len(user_message)})")
                return ai_response
            else:
                logger.warning("Empty response from Gemini")
                return self._get_fallback_response()
                
        except Exception as e:
            logger.error(f"Error getting response from Gemini: {e}")
            return self._get_fallback_response()
    
    def _get_fallback_response(self):
        """Return a fallback response if Gemini API fails"""
        fallback_responses = [
            "I hear you, and I want you to know that your feelings are completely valid. Sometimes it helps to take a deep breath and remember that difficult moments are temporary.",
            "Thank you for sharing with me. It takes courage to reach out. What you're feeling is important, and you deserve support and understanding.",
            "I'm here to listen and support you. While I'm having a moment of technical difficulty, please know that whatever you're going through, you're not alone in this.",
            "Your mental health matters, and reaching out shows real strength. Take things one step at a time, and be gentle with yourself."
        ]
        
        import random
        return random.choice(fallback_responses)
