// Webcam handling
class WebcamManager {
  constructor() {
    this.video = document.getElementById('webcam');
    this.canvas = document.getElementById('snapshot');
    this.stream = null;
    this.initialized = false;
  }

  async init() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      this.video.srcObject = this.stream;
      this.initialized = true;
      console.log('Webcam initialized');
      return true;
    } catch (err) {
      console.error('Webcam error:', err);
      alert('Could not access webcam. Please allow camera permissions.');
      return false;
    }
  }

  captureFrame() {
    if (!this.initialized) return null;
    
    const ctx = this.canvas.getContext('2d');
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    
    // Draw current frame
    ctx.drawImage(this.video, 0, 0);
    
    // Return as base64 JPEG
    return this.canvas.toDataURL('image/jpeg', 0.8);
  }

  captureFrameAsBlob() {
    return new Promise((resolve) => {
      if (!this.initialized) {
        resolve(null);
        return;
      }
      
      const ctx = this.canvas.getContext('2d');
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      ctx.drawImage(this.video, 0, 0);
      
      this.canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.8);
    });
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.initialized = false;
    }
  }
}

const webcam = new WebcamManager();
