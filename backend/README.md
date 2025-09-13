# MentiSphere Backend API

Simple Flask API for Google Gemini chatbot integration.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
Edit the `.env` file and add your Google Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run the Server
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/health` - Check if the API is running
- **Response**: `{"status": "healthy", "service": "MentiSphere Chat API", "gemini_ready": true}`

### Chat
- **POST** `/api/chat` - Send a message to the AI
- **Body**: `{"message": "How are you?"}`
- **Response**: `{"response": "AI response here", "status": "success"}`

## Features

- ✅ Simple and clean implementation
- ✅ Comprehensive error handling with fallback responses
- ✅ CORS enabled for frontend integration
- ✅ Logging for debugging
- ✅ Health check endpoint
- ✅ Graceful degradation when API fails

## Error Handling

The API includes multiple layers of error handling:
1. Configuration validation on startup
2. Gemini API error handling with fallbacks
3. Network error handling in frontend
4. Static fallback responses for worst-case scenarios

This ensures the chat always works, even when there are connectivity issues!