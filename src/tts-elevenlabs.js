// ElevenLabs TTS for high-quality voice
class ElevenLabsTTS {
  constructor(apiKey, voiceId) {
    this.apiKey = apiKey;
    this.voiceId = voiceId || 'EXAVITQu4vr4xnSDxMaL'; // Default: Sarah (warm female)
    this.baseUrl = 'https://api.elevenlabs.io/v1';
    this.speaking = false;
    this.audioElement = null;
  }

  setVoice(voiceId) {
    this.voiceId = voiceId;
  }

  async speak(text, onStart, onEnd) {
    if (!this.apiKey) {
      console.error('ElevenLabs API key not set');
      // Fallback to browser TTS
      return miraTTS.speak(text, onStart, onEnd);
    }

    try {
      this.speaking = true;
      if (onStart) onStart();

      // Call ElevenLabs API
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${this.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.5,
              use_speaker_boost: true
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail?.message || 'ElevenLabs API error');
      }

      // Get audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      return new Promise((resolve) => {
        this.audioElement = new Audio(audioUrl);
        
        this.audioElement.onended = () => {
          this.speaking = false;
          URL.revokeObjectURL(audioUrl);
          if (onEnd) onEnd();
          resolve();
        };

        this.audioElement.onerror = (err) => {
          console.error('Audio playback error:', err);
          this.speaking = false;
          if (onEnd) onEnd();
          resolve();
        };

        this.audioElement.play().catch(err => {
          console.error('Failed to play audio:', err);
          this.speaking = false;
          if (onEnd) onEnd();
          resolve();
        });
      });

    } catch (err) {
      console.error('ElevenLabs TTS error:', err);
      this.speaking = false;
      if (onEnd) onEnd();
      
      // Fallback to browser TTS
      console.log('Falling back to browser TTS...');
      return miraTTS.speak(text, onStart, onEnd);
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    this.speaking = false;
  }

  isSpeaking() {
    return this.speaking;
  }

  // List available voices (for debugging)
  async listVoices() {
    if (!this.apiKey) return [];
    
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: { 'xi-api-key': this.apiKey }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.voices;
    }
    return [];
  }
}

// Will be initialized in config if API key is provided
let elevenLabsTTS = null;

function initElevenLabs() {
  if (CONFIG.ELEVENLABS_API_KEY && CONFIG.ELEVENLABS_API_KEY !== 'YOUR_ELEVENLABS_API_KEY') {
    elevenLabsTTS = new ElevenLabsTTS(CONFIG.ELEVENLABS_API_KEY, CONFIG.ELEVENLABS_VOICE_ID);
    console.log('ElevenLabs TTS initialized');
    return true;
  }
  return false;
}

// Smart TTS function that uses ElevenLabs if available, otherwise browser TTS
async function smartSpeak(text, onStart, onEnd) {
  if (elevenLabsTTS) {
    return elevenLabsTTS.speak(text, onStart, onEnd);
  } else {
    return miraTTS.speak(text, onStart, onEnd);
  }
}
