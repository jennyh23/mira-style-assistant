// Text-to-speech for Mira's voice
class MiraTTS {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.speaking = false;
    this.ready = false;
    this.initVoice();
  }

  initVoice() {
    const setVoice = () => {
      const voices = this.synth.getVoices();
      if (voices.length === 0) {
        console.log('No voices available yet...');
        return;
      }
      
      // Try to find a nice female voice
      this.voice = voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('Karen') ||
        v.name.includes('Moira') ||
        v.name.includes('Google US English Female') ||
        v.name.includes('Microsoft Zira')
      ) || voices.find(v => 
        v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
      ) || voices.find(v => 
        v.lang.startsWith('en-US')
      ) || voices.find(v => 
        v.lang.startsWith('en')
      ) || voices[0];
      
      this.ready = true;
      console.log('TTS ready, using voice:', this.voice?.name);
    };

    // Try immediately
    setVoice();
    
    // Also listen for voices changed (some browsers load async)
    this.synth.addEventListener('voiceschanged', setVoice);
    
    // Force load on some browsers
    setTimeout(() => {
      if (!this.ready) setVoice();
    }, 100);
  }

  async speak(text, onStart, onEnd) {
    return new Promise((resolve) => {
      if (!CONFIG.TTS_ENABLED) {
        console.log('TTS disabled');
        if (onStart) onStart();
        setTimeout(() => {
          if (onEnd) onEnd();
          resolve();
        }, text.length * 50); // Fake duration
        return;
      }

      if (!this.synth) {
        console.error('Speech synthesis not supported');
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();
      
      // Wait for ready
      if (!this.ready) {
        console.log('Waiting for TTS to be ready...');
        setTimeout(() => this.speak(text, onStart, onEnd).then(resolve), 200);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (this.voice) {
        utterance.voice = this.voice;
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log('TTS started');
        this.speaking = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        console.log('TTS ended');
        this.speaking = false;
        if (onEnd) onEnd();
        resolve();
      };

      utterance.onerror = (err) => {
        console.error('TTS error:', err);
        this.speaking = false;
        if (onEnd) onEnd();
        resolve();
      };

      // Chrome bug workaround - need to resume if paused
      if (this.synth.paused) {
        this.synth.resume();
      }

      console.log('Speaking:', text.substring(0, 50) + '...');
      this.synth.speak(utterance);
      
      // Chrome bug: sometimes onend doesn't fire
      // Set a timeout based on text length as fallback
      const timeout = Math.max(5000, text.length * 80);
      setTimeout(() => {
        if (this.speaking) {
          console.log('TTS timeout fallback');
          this.speaking = false;
          if (onEnd) onEnd();
          resolve();
        }
      }, timeout);
    });
  }

  stop() {
    this.synth.cancel();
    this.speaking = false;
  }

  isSpeaking() {
    return this.speaking;
  }
  
  // Test TTS with a short phrase (call on user gesture)
  test() {
    return this.speak("Hey there!");
  }
}

const miraTTS = new MiraTTS();
