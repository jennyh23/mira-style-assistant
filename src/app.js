// Main application
class MiraStyleAssistant {
  constructor() {
    this.analyzeBtn = document.getElementById('analyze-btn');
    this.talkBtn = document.getElementById('talk-btn');
    this.speechBubble = document.getElementById('speech-bubble');
    this.miraText = document.getElementById('mira-text');
    this.userText = document.getElementById('user-text');
    this.voiceIndicator = document.getElementById('voice-indicator');
    this.isProcessing = false;
    this.hasInteracted = false;
    
    this.init();
  }

  async init() {
    console.log('Initializing Mira Style Assistant...');
    
    // Initialize avatar videos
    await miraAvatar.init();
    console.log('Avatar OK');
    
    // Initialize webcam
    const webcamOk = await webcam.init();
    if (!webcamOk) {
      this.showMessage("couldn't access your camera - check permissions?");
    } else {
      console.log('Webcam OK');
    }
    
    // Initialize Gemini
    if (!initGemini()) {
      this.showMessage("need a Gemini API key in config.js to work~");
      return;
    }
    console.log('Gemini OK');
    
    // Initialize ElevenLabs (optional, will fall back to browser TTS)
    if (initElevenLabs()) {
      console.log('ElevenLabs OK');
    } else {
      console.log('Using browser TTS (add ELEVENLABS_API_KEY for better voice)');
    }
    
    // Set up button listeners
    if (this.analyzeBtn) {
      this.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
    }
    
    if (this.talkBtn) {
      this.talkBtn.addEventListener('click', () => this.handleTalk());
    }
    
    // Set up speech recognition callbacks
    if (speechInput.supported) {
      speechInput.onStart = () => {
        this.voiceIndicator?.classList.add('active');
        miraAvatar.idle(); // Show idle when user is talking
      };
      
      speechInput.onInterim = (text) => {
        if (this.userText) {
          this.userText.textContent = text + '...';
          this.userText.parentElement.style.display = 'block';
        }
      };
      
      speechInput.onResult = (text) => {
        if (this.userText) {
          this.userText.textContent = text;
        }
        this.processUserSpeech(text);
      };
      
      speechInput.onEnd = () => {
        this.voiceIndicator?.classList.remove('active');
        if (this.talkBtn) {
          this.talkBtn.textContent = '🎤 Talk to Mira';
          this.talkBtn.classList.remove('listening');
        }
      };
      
      console.log('Speech recognition OK');
    } else {
      console.warn('Speech recognition not supported');
      if (this.talkBtn) {
        this.talkBtn.style.display = 'none';
      }
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      if (e.code === 'Space' && !this.isProcessing) {
        e.preventDefault();
        this.handleAnalyze();
      } else if (e.code === 'KeyT' && !this.isProcessing) {
        e.preventDefault();
        this.handleTalk();
      }
    });
    
    this.showMessage("hey! press space to show your outfit, or T to talk to me~");
    console.log('Mira Style Assistant ready!');
  }

  handleAnalyze() {
    this.unlockAudio();
    this.analyzeOutfit();
  }

  handleTalk() {
    this.unlockAudio();
    
    if (speechInput.isListening) {
      speechInput.stop();
    } else {
      if (this.talkBtn) {
        this.talkBtn.textContent = '🔴 Listening...';
        this.talkBtn.classList.add('listening');
      }
      speechInput.start();
    }
  }

  unlockAudio() {
    if (!this.hasInteracted) {
      this.hasInteracted = true;
      const warmup = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(warmup);
    }
  }

  showMessage(text) {
    if (this.miraText) {
      this.miraText.textContent = text;
    }
  }

  async processUserSpeech(userText) {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    miraAvatar.thinking();
    this.showMessage("hmm let me think about that...");
    
    try {
      // Capture current frame for context
      const imageData = webcam.captureFrame();
      
      // Send to Gemini with user's question
      console.log('Processing:', userText);
      const response = await gemini.analyzeOutfit(imageData, userText);
      console.log('Response:', response);
      
      await this.deliverResponse(response);
      
    } catch (err) {
      console.error('Error:', err);
      miraAvatar.concerned();
      this.showMessage("sorry, something went wrong - " + err.message);
    } finally {
      this.isProcessing = false;
    }
  }

  async analyzeOutfit() {
    if (this.isProcessing || !gemini) return;
    
    this.isProcessing = true;
    if (this.analyzeBtn) {
      this.analyzeBtn.disabled = true;
      this.analyzeBtn.textContent = 'Thinking...';
    }
    
    miraAvatar.thinking();
    this.showMessage("hmm let me see what you're wearing...");
    
    try {
      const imageData = webcam.captureFrame();
      if (!imageData) {
        throw new Error('Could not capture image');
      }
      
      console.log('Analyzing outfit...');
      const response = await gemini.analyzeOutfit(imageData);
      console.log('Response:', response);
      
      await this.deliverResponse(response);
      
    } catch (err) {
      console.error('Analysis error:', err);
      miraAvatar.concerned();
      this.showMessage("oops - " + err.message);
    } finally {
      this.isProcessing = false;
      if (this.analyzeBtn) {
        this.analyzeBtn.disabled = false;
        this.analyzeBtn.textContent = 'Ask Mira';
      }
    }
  }

  async deliverResponse(text) {
    this.showMessage(text);
    
    // Check for scripted response match
    const scripted = findScriptedResponse(text);
    
    if (scripted) {
      console.log('Using scripted response:', scripted.phrase);
      // Play scripted video with baked-in audio
      await miraAvatar.playScriptedVideo(scripted.video);
    } else {
      // No scripted match - use generic talking + TTS
      console.log('Using dynamic response with TTS');
      const emotion = detectEmotion(text);
      
      // Set initial emotion state
      if (emotion === 'excited') {
        miraAvatar.excited();
      } else if (emotion === 'happy') {
        miraAvatar.happy();
      } else if (emotion === 'concerned') {
        miraAvatar.concerned();
      } else if (emotion === 'thinking') {
        miraAvatar.thinking();
      }
      
      // Speak with TTS while showing talking animation
      await smartSpeak(
        text,
        () => miraAvatar.talking(),
        () => miraAvatar.idle()
      );
    }
  }
}

// Start when ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Starting Mira...');
  window.app = new MiraStyleAssistant();
});

// Debug helpers
window.debug = {
  testTTS: () => miraTTS.speak("Hey there! How's my outfit looking?"),
  testSpeech: () => speechInput.start(),
  testScripted: (phrase) => {
    const match = findScriptedResponse(phrase);
    console.log('Scripted match:', match);
    if (match) miraAvatar.playScriptedVideo(match.video);
  },
  app: () => window.app,
};
