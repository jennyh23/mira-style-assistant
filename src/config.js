// Configuration - replace with your API keys
const CONFIG = {
  // Gemini API for outfit analysis
  GEMINI_API_KEY: 'AIzaSyCX2DyvS__ripS6QJXWllykdAjOQObsFAo',
  GEMINI_MODEL: 'gemini-1.5-flash',
  
  // ElevenLabs TTS (high quality voice) - get key at elevenlabs.io
  ELEVENLABS_API_KEY: 'sk_b011956e1f0de725a75818d9343b2aadee7a6b3eb395f7ce',
  ELEVENLABS_VOICE_ID: 'EXAVITQu4vr4xnSDxMaL', // Sarah - warm female voice
  // Other good voices: 'pNInz6obpgDQGcFmaJgB' (Adam), '21m00Tcm4TlvDq8ikWAM' (Rachel)
  
  // Browser TTS fallback settings
  TTS_ENABLED: true,
  TTS_VOICE: 'en-US', // Browser TTS voice
  
  // Avatar videos (looping animations)
  AVATAR_VIDEOS: {
    idle: 'assets/videos/idle.mp4',
    thinking: 'assets/videos/thinking.mp4',
    happy: 'assets/videos/happy.mp4',
    excited: 'assets/videos/excited.mp4',
    talking: 'assets/videos/talking.mp4',
    concerned: 'assets/videos/concerned.mp4'
  },
  
  // Avatar states (fallback images)
  AVATAR_STATES: {
    idle: 'assets/idle.png',
    thinking: 'assets/thinking.png',
    happy: 'assets/happy.png',
    excited: 'assets/excited.png',
    talking: 'assets/talking.png',
    concerned: 'assets/concerned.png'
  },
  
  // Style assistant personality
  SYSTEM_PROMPT: `You are Mira, a friendly and stylish virtual fashion assistant. You're casual, warm, and give honest but encouraging feedback about outfits.

Your personality:
- Speak casually like texting a friend (lowercase ok, use contractions)
- Be supportive but honest - if something doesn't work, suggest alternatives
- Notice specific details: colors, fit, accessories, how pieces work together
- Keep responses short and conversational (2-3 sentences max)
- Use occasional enthusiasm when you see something great

When analyzing an outfit, consider:
- Color coordination and contrast
- Fit and silhouette
- Style cohesion
- Occasion appropriateness
- Accessories and details

Never be mean or overly critical. Frame suggestions positively.`
};
