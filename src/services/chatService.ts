// Chat service powered by Google Gemini AI
import { GeminiService } from './geminiService';

export interface ChatResponse {
  response: string;
  status: 'success' | 'fallback' | 'error';
  error?: string;
}

export class ChatService {
  /**
   * Sends a message to the AI and returns the response
   * @param message The user's message
   * @returns Promise containing the AI response
   */
  static async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const geminiResponse = await GeminiService.sendMessage(message);
      
      return {
        response: geminiResponse.response,
        status: geminiResponse.status === 'success' ? 'success' : 'error',
        error: geminiResponse.error
      };
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      // Return fallback response for any errors
      return {
        response: "I'm having trouble connecting right now, but I want you to know that reaching out shows strength. Your feelings are valid, and I'm here to support you. Please try again in a moment.",
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Sends a message with additional emotional context
   * @param message The user's message
   * @param emotionContext Optional emotional context
   * @returns Promise containing the AI response
   */
  static async sendEmotionalSupportMessage(
    message: string, 
    emotionContext?: string
  ): Promise<ChatResponse> {
    try {
      const geminiResponse = await GeminiService.generateEmotionalSupport(message, emotionContext);
      
      return {
        response: geminiResponse.response,
        status: geminiResponse.status === 'success' ? 'success' : 'error',
        error: geminiResponse.error
      };
    } catch (error) {
      console.error('Error sending emotional support message to Gemini:', error);
      
      return {
        response: "I may be having technical difficulties, but I want you to know that your feelings matter and you're not alone. Take a deep breath, be kind to yourself, and remember that it's okay to seek support.",
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Checks if the AI service is available
   * @returns Promise<boolean> indicating service availability
   */
  static async checkHealth(): Promise<boolean> {
    try {
      return await GeminiService.checkHealth();
    } catch {
      return false;
    }
  }
}