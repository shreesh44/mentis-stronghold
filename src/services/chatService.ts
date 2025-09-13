// Simple API service for chatbot communication
const API_BASE_URL = 'http://localhost:5000';

export interface ChatResponse {
  response: string;
  status: 'success' | 'fallback' | 'error';
  error?: string;
}

export class ChatService {
  static async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to API:', error);
      
      // Return fallback response for any API errors
      return {
        response: "I'm having trouble connecting right now, but I want you to know that reaching out shows strength. Please try again in a moment.",
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}