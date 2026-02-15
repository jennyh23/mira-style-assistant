// Gemini API for outfit analysis
class GeminiAnalyzer {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.model = CONFIG.GEMINI_MODEL;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  async analyzeOutfit(imageBase64, userPrompt = '') {
    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    const prompt = userPrompt || "What do you think of my outfit?";
    
    const requestBody = {
      contents: [{
        parts: [
          {
            text: `${CONFIG.SYSTEM_PROMPT}\n\nUser says: "${prompt}"\n\nLook at what they're wearing and respond as Mira.`
          },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 200,
        topP: 0.9
      }
    };

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();
      
      // Extract text from response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No response generated');
      }
      
      return text.trim();
    } catch (err) {
      console.error('Gemini API error:', err);
      throw err;
    }
  }
}

let gemini = null;

function initGemini() {
  if (CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') {
    gemini = new GeminiAnalyzer(CONFIG.GEMINI_API_KEY);
    return true;
  }
  return false;
}
