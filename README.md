# Mira Style Assistant

Real-time AI style assistant with animated avatar.

## Features
- Webcam outfit analysis via Gemini Vision
- Voice input (speech recognition)
- Voice output (ElevenLabs TTS)
- Animated avatar with emotion states (Kling AI videos)

## Setup
1. Add your API keys to src/config.js
2. Run: python3 -m http.server 8888
3. Open http://localhost:8888

## API Keys Needed
- GEMINI_API_KEY - for outfit analysis
- ELEVENLABS_API_KEY - for voice (optional, falls back to browser TTS)
- KLING keys - to generate new avatar videos

