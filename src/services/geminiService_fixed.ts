// Simple, working Gemini AI Service
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface GeminiResponse {
  response: string;
  status: 'success' | 'error';
  error?: string;
}

export class GeminiService {
  static async sendMessage(message: string): Promise<GeminiResponse> {
    try {
      console.log('🚀 Gemini API Call Starting...');
      console.log('API Key:', API_KEY ? 'Present' : 'Missing');
      
      if (!API_KEY) {
        throw new Error('API key missing');
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
      
      const body = {
        contents: [{
          parts: [{
            text: `You are a supportive AI assistant. Respond helpfully to: ${message}`
          }]
        }]
      };

      console.log('📤 Sending to:', url.split('?')[0]);
      console.log('📤 Body:', JSON.stringify(body, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      console.log('📥 Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('📥 Response:', data);

      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = data.candidates[0].content.parts[0].text;
        console.log('✅ Success:', text.substring(0, 50) + '...');
        return {
          response: text,
          status: 'success'
        };
      }

      throw new Error('Invalid response structure');

    } catch (error) {
      console.error('💥 Gemini Error:', error);
      return {
        response: "I'm having technical difficulties. Please try again in a moment.",
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const result = await this.sendMessage('Hello');
      return result.status === 'success';
    } catch {
      return false;
    }
  }

  static async generateEmotionalSupport(message: string, emotionContext?: string): Promise<GeminiResponse> {
    const contextMessage = emotionContext 
      ? `${emotionContext} - ${message}` 
      : message;
    return this.sendMessage(contextMessage);
  }
}