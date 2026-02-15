#!/bin/bash
# Generate scripted audio + lipsync videos for Mira

SKILL_DIR="/app/skills"
AUDIO_DIR="assets/audio/scripted"
VIDEO_DIR="assets/videos/scripted"
IMAGE="../../identity/3d1fc126-13c5-4cfe-8df1-95dccf22faa2-reference.png"
VOICE_ID="EXAVITQu4vr4xnSDxMaL"  # Sarah voice

# Export API key
export ELEVEN_API_KEY="sk_b011956e1f0de725a75818d9343b2aadee7a6b3eb395f7ce"

cd /data/.pikabot/workspace/projects/mira-style-assistant

# Scripted lines with emotions
declare -A LINES
LINES["judgmental_gross"]="ew that's gross"
LINES["judgmental_honey"]="oh no honey what is that"
LINES["judgmental_choice"]="that's... a choice"
LINES["confused_why"]="why would you wear that"
LINES["confused_what"]="wait what is happening here"
LINES["confused_lost"]="i'm so confused right now"
LINES["positive_love"]="okay i love that"
LINES["positive_yes"]="yes this is it"
LINES["positive_amazing"]="you look amazing"
LINES["neutral_see"]="hmm let me see"
LINES["neutral_thing"]="okay here's the thing"
LINES["supportive_works"]="you know what it works"
LINES["supportive_notbad"]="not bad at all"

for key in "${!LINES[@]}"; do
    text="${LINES[$key]}"
    echo "=== Generating: $key ==="
    echo "Text: $text"
    
    # Generate audio
    python "$SKILL_DIR/elevenlabs-voice/scripts/tts-elevenlabs.py" \
        "$VOICE_ID" "$text" "$AUDIO_DIR/${key}.mp3"
    
    if [ -f "$AUDIO_DIR/${key}.mp3" ]; then
        echo "Audio saved: $AUDIO_DIR/${key}.mp3"
    else
        echo "ERROR: Audio generation failed for $key"
        continue
    fi
done

echo "=== Audio generation complete ==="
