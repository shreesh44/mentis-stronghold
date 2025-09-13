// Gemini AI Service for Emotion Mirror
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Try multiple endpoints in order of preference
const GEMINI_ENDPOINTS = [
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
  `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`
];

export interface GeminiResponse {
  response: string;
  status: 'success' | 'error';
  error?: string;
}

export class GeminiService {
  /**
   * Try multiple endpoints until one works
   */
  private static async tryMultipleEndpoints(requestBody: any): Promise<any> {
    for (let i = 0; i < GEMINI_ENDPOINTS.length; i++) {
      const endpoint = GEMINI_ENDPOINTS[i];
      try {
        console.log(`🧪 Trying endpoint ${i + 1}/${GEMINI_ENDPOINTS.length}:`, endpoint.split('?')[0]);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        console.log(`📥 Response status:`, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Success with endpoint ${i + 1}!`);
          return data;
        } else {
          const errorText = await response.text();
          console.log(`❌ Endpoint ${i + 1} failed:`, response.status, errorText);
        }
      } catch (error) {
        console.log(`❌ Endpoint ${i + 1} error:`, error);
      }
    }
    throw new Error('All endpoints failed');
  }

  /**
   * Sends a message to Gemini and returns the response
   */
  static async sendMessage(message: string): Promise<GeminiResponse> {
    try {
      console.log('🔍 Starting Gemini API call...');
      console.log('API Key available:', !!API_KEY);
      console.log('API Key length:', API_KEY?.length);
      
      if (!API_KEY) {
        console.error('❌ API key not configured');
        throw new Error('API key not configured');
      }

      const requestBody = {
        contents: [{
          parts: [{
            text: `You are an empathetic AI companion called "Emotion Mirror" that provides emotional support and mental wellness guidance. Respond warmly, supportively, and professionally to help users with their emotional needs.

User message: ${message}

Please provide a compassionate, helpful response:`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.8,
          topK: 40
        }
      };

      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

      const data = await this.tryMultipleEndpoints(requestBody);
      console.log('📥 Response data:', data);
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log('✅ Success! Got response:', data.candidates[0].content.parts[0].text.substring(0, 100) + '...');
        return {
          response: data.candidates[0].content.parts[0].text,
          status: 'success'
        };
      } else {
        console.error('❌ Invalid response format:', data);
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Gemini Service Error:', error);
      return {
        response: "I'm experiencing some technical difficulties right now, but I want you to know that reaching out shows strength. Your feelings are valid and important. Please try again in a moment.",
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Health check for the service
   */
  static async checkHealth(): Promise<boolean> {
    try {
      if (!API_KEY) return false;
      
      const requestBody = {
        contents: [{ parts: [{ text: "Hello" }] }]
      };
      
      const data = await this.tryMultipleEndpoints(requestBody);
      return !!data.candidates;
    } catch {
      return false;
    }
  }

  /**
   * Enhanced emotional support with context
   */
  static async generateEmotionalSupport(
    message: string, 
    emotionContext?: string
  ): Promise<GeminiResponse> {
    try {
      if (!API_KEY) {
        throw new Error('API key not configured');
      }

      let prompt = `You are "Emotion Mirror", a specialized AI for emotional support and mental wellness. `;
      
      if (emotionContext) {
        prompt += `The user seems to be experiencing: ${emotionContext}. `;
      }
      
      prompt += `Please provide a compassionate, supportive response that validates their feelings and offers gentle guidance.

User message: ${message}

Your supportive response:`;

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      };

      const data = await this.tryMultipleEndpoints(requestBody);
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return {
          response: data.candidates[0].content.parts[0].text,
          status: 'success'
        };
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Emotional Support Error:', error);
      return {
        response: "I may be having technical difficulties, but I want you to know that your feelings matter and you're not alone. Take a deep breath, be kind to yourself, and remember that it's okay to seek support.",
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}