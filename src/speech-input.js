// Speech recognition for voice input
class SpeechInput {
  constructor() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      this.supported = false;
      return;
    }
    
    this.supported = true;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    
    this.isListening = false;
    this.onResult = null;
    this.onStart = null;
    this.onEnd = null;
    this.onInterim = null;
    
    this.setupHandlers();
  }

  setupHandlers() {
    if (!this.supported) return;
    
    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isListening = true;
      if (this.onStart) this.onStart();
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      this.isListening = false;
      if (this.onEnd) this.onEnd();
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      if (this.onEnd) this.onEnd();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Show interim results (what user is saying)
      if (interimTranscript && this.onInterim) {
        this.onInterim(interimTranscript);
      }

      // Final result
      if (finalTranscript && this.onResult) {
        console.log('Final transcript:', finalTranscript);
        this.onResult(finalTranscript);
      }
    };
  }

  start() {
    if (!this.supported) {
      console.error('Speech recognition not supported');
      return false;
    }
    
    if (this.isListening) {
      console.log('Already listening');
      return true;
    }

    try {
      this.recognition.start();
      return true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      return false;
    }
  }

  stop() {
    if (this.isListening) {
      this.recognition.stop();
    }
  }
}

const speechInput = new SpeechInput();
