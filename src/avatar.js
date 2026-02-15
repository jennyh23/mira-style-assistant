// Avatar state management with video loops
class MiraAvatar {
  constructor() {
    this.container = document.getElementById('mira-avatar-container');
    this.stateIndicator = document.getElementById('state-indicator');
    this.currentState = 'idle';
    this.videos = {};
    this.currentVideo = null;
    this.initialized = false;
  }

  async init() {
    // Create video elements for each state
    const states = ['idle', 'thinking', 'happy', 'excited', 'talking', 'concerned'];
    
    for (const state of states) {
      const video = document.createElement('video');
      video.id = `video-${state}`;
      video.className = 'avatar-video';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      
      // Set source based on config
      const src = CONFIG.AVATAR_VIDEOS?.[state] || `assets/videos/${state}.mp4`;
      video.src = src;
      
      // Hide all videos initially
      video.style.display = 'none';
      
      this.container.appendChild(video);
      this.videos[state] = video;
      
      // Preload
      video.load();
    }
    
    // Show idle by default
    this.setState('idle');
    this.initialized = true;
    console.log('Avatar videos initialized');
  }

  setState(state) {
    if (!this.videos[state]) {
      console.warn(`Unknown avatar state: ${state}`);
      return;
    }
    
    // Hide current video
    if (this.currentVideo) {
      this.currentVideo.pause();
      this.currentVideo.style.display = 'none';
    }
    
    // Show and play new video
    this.currentVideo = this.videos[state];
    this.currentVideo.style.display = 'block';
    this.currentVideo.currentTime = 0;
    this.currentVideo.play().catch(err => {
      console.warn('Video autoplay failed:', err);
    });
    
    // Update indicator
    if (this.stateIndicator) {
      this.stateIndicator.textContent = state;
    }
    this.currentState = state;
  }

  idle() {
    this.setState('idle');
  }

  thinking() {
    this.setState('thinking');
  }

  talking() {
    this.setState('talking');
  }

  happy() {
    this.setState('happy');
    // Stay happy for a bit then return to idle
    setTimeout(() => {
      if (this.currentState === 'happy') this.idle();
    }, 5000);
  }

  excited() {
    this.setState('excited');
    setTimeout(() => {
      if (this.currentState === 'excited') this.idle();
    }, 5000);
  }

  concerned() {
    this.setState('concerned');
  }

  // Determine state based on sentiment of response
  reactToResponse(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('love') || lowerText.includes('amazing') || 
        lowerText.includes('perfect') || lowerText.includes('gorgeous') ||
        lowerText.includes('stunning') || lowerText.includes('wow')) {
      return 'excited';
    } else if (lowerText.includes('great') || lowerText.includes('nice') || 
               lowerText.includes('good') || lowerText.includes('cute') ||
               lowerText.includes('like')) {
      return 'happy';
    } else if (lowerText.includes('maybe') || lowerText.includes('try') || 
               lowerText.includes('hmm') || lowerText.includes('suggest') ||
               lowerText.includes('could') || lowerText.includes('might')) {
      return 'concerned';
    }
    return 'happy'; // default positive
  }
}

const miraAvatar = new MiraAvatar();
