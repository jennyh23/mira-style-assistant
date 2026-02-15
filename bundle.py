import base64

# Read all the JS files
config_js = open('src/config.js').read()
avatar_js = open('src/avatar.js').read()
webcam_js = open('src/webcam.js').read()
gemini_js = open('src/gemini.js').read()
tts_js = open('src/tts.js').read()
tts_elevenlabs_js = open('src/tts-elevenlabs.js').read()
speech_input_js = open('src/speech-input.js').read()
app_js = open('src/app.js').read()

# Read CSS
css = open('style.css').read()

# Read and encode images
def img_to_base64(path):
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode()

images = {
    'idle': img_to_base64('assets/idle.png'),
    'thinking': img_to_base64('assets/thinking.png'),
    'happy': img_to_base64('assets/happy.png'),
    'excited': img_to_base64('assets/excited.png'),
    'talking': img_to_base64('assets/talking.png'),
    'concerned': img_to_base64('assets/concerned.png'),
}

# Update config to use base64 images
config_js = config_js.replace("'assets/idle.png'", f"'data:image/png;base64,{images['idle']}'")
config_js = config_js.replace("'assets/thinking.png'", f"'data:image/png;base64,{images['thinking']}'")
config_js = config_js.replace("'assets/happy.png'", f"'data:image/png;base64,{images['happy']}'")
config_js = config_js.replace("'assets/excited.png'", f"'data:image/png;base64,{images['excited']}'")
config_js = config_js.replace("'assets/talking.png'", f"'data:image/png;base64,{images['talking']}'")
config_js = config_js.replace("'assets/concerned.png'", f"'data:image/png;base64,{images['concerned']}'")

# Create bundled HTML
html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mira - Style Assistant</title>
  <style>
{css}
  </style>
</head>
<body>
  <div class="container">
    <div class="webcam-container">
      <video id="webcam" autoplay playsinline></video>
      <canvas id="snapshot" style="display: none;"></canvas>
      <div class="user-speech-bubble" id="user-speech-bubble" style="display: none;">
        <p id="user-text"></p>
      </div>
      <div class="controls">
        <button id="analyze-btn" class="btn-primary">👁️ Show Outfit</button>
        <button id="talk-btn" class="btn-secondary">🎤 Talk to Mira</button>
      </div>
    </div>
    <div class="mira-panel">
      <div class="avatar-container">
        <img id="mira-avatar" src="data:image/png;base64,{images['idle']}" alt="Mira">
        <div class="state-indicator" id="state-indicator">idle</div>
      </div>
      <div class="speech-bubble" id="speech-bubble">
        <p id="mira-text">Hey! Show me your outfit or talk to me~</p>
      </div>
    </div>
  </div>
  <div class="voice-indicator" id="voice-indicator">
    <div class="pulse"></div>
    <span>Listening...</span>
  </div>
  <script>
{config_js}
{avatar_js}
{webcam_js}
{gemini_js}
{tts_js}
{tts_elevenlabs_js}
{speech_input_js}
{app_js}
  </script>
</body>
</html>'''

with open('mira-style-assistant.html', 'w') as f:
    f.write(html)

print(f"Bundle created: mira-style-assistant.html ({len(html)//1024}KB)")
