// Scripted response mapping - videos with baked-in audio
const SCRIPTED_RESPONSES = {
  // Judgmental responses
  "ew that's gross": {
    video: 'assets/videos/scripted/judgmental_gross.mp4',
    emotion: 'judgmental',
    keywords: ['gross', 'ew', 'disgusting', 'ugly']
  },
  "oh no honey what is that": {
    video: 'assets/videos/scripted/judgmental_honey.mp4',
    emotion: 'judgmental',
    keywords: ['honey', 'what is that', 'oh no']
  },
  "that's... a choice": {
    video: 'assets/videos/scripted/judgmental_choice.mp4',
    emotion: 'judgmental',
    keywords: ['choice', 'interesting choice', 'bold']
  },
  
  // Confused responses
  "why would you wear that": {
    video: 'assets/videos/scripted/confused_why.mp4',
    emotion: 'confused',
    keywords: ['why', 'wear that', 'why would']
  },
  "wait what is happening here": {
    video: 'assets/videos/scripted/confused_what.mp4',
    emotion: 'confused',
    keywords: ['what is happening', 'what', 'wait']
  },
  "i'm so confused right now": {
    video: 'assets/videos/scripted/confused_lost.mp4',
    emotion: 'confused',
    keywords: ['confused', 'lost', 'don\'t understand']
  },
  
  // Positive responses
  "okay i love that": {
    video: 'assets/videos/scripted/positive_love.mp4',
    emotion: 'excited',
    keywords: ['love', 'love that', 'love it']
  },
  "yes this is it": {
    video: 'assets/videos/scripted/positive_yes.mp4',
    emotion: 'excited',
    keywords: ['yes', 'this is it', 'perfect']
  },
  "you look amazing": {
    video: 'assets/videos/scripted/positive_amazing.mp4',
    emotion: 'happy',
    keywords: ['amazing', 'look amazing', 'stunning', 'gorgeous']
  },
  
  // Neutral responses
  "hmm let me see": {
    video: 'assets/videos/scripted/neutral_see.mp4',
    emotion: 'thinking',
    keywords: ['hmm', 'let me see', 'thinking']
  },
  "okay here's the thing": {
    video: 'assets/videos/scripted/neutral_thing.mp4',
    emotion: 'thinking',
    keywords: ['here\'s the thing', 'the thing is', 'okay so']
  },
  
  // Supportive responses
  "you know what it works": {
    video: 'assets/videos/scripted/supportive_works.mp4',
    emotion: 'happy',
    keywords: ['it works', 'works', 'actually works']
  },
  "not bad at all": {
    video: 'assets/videos/scripted/supportive_notbad.mp4',
    emotion: 'happy',
    keywords: ['not bad', 'pretty good', 'decent']
  }
};

// Find best matching scripted response
function findScriptedResponse(text) {
  const lowerText = text.toLowerCase();
  
  // First, try exact match
  for (const [phrase, data] of Object.entries(SCRIPTED_RESPONSES)) {
    if (lowerText.includes(phrase)) {
      return { phrase, ...data };
    }
  }
  
  // Then, try keyword matching
  let bestMatch = null;
  let bestScore = 0;
  
  for (const [phrase, data] of Object.entries(SCRIPTED_RESPONSES)) {
    let score = 0;
    for (const keyword of data.keywords) {
      if (lowerText.includes(keyword)) {
        score += keyword.length; // longer keyword matches = better
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = { phrase, ...data };
    }
  }
  
  // Only return if we have a decent match
  return bestScore >= 4 ? bestMatch : null;
}

// Get emotion from response for fallback video selection
function detectEmotion(text) {
  const lowerText = text.toLowerCase();
  
  // Check for emotion indicators
  if (/ew|gross|ugly|terrible|awful|yuck|no no|honey/.test(lowerText)) {
    return 'concerned'; // judgmental uses concerned video
  }
  if (/confused|what|why|huh|\?{2,}|don't understand/.test(lowerText)) {
    return 'thinking';
  }
  if (/love|amazing|perfect|yes!|gorgeous|stunning|beautiful|great/.test(lowerText)) {
    return 'excited';
  }
  if (/good|nice|works|not bad|decent|okay|fine/.test(lowerText)) {
    return 'happy';
  }
  if (/hmm|let me|thinking|consider/.test(lowerText)) {
    return 'thinking';
  }
  
  return 'talking'; // default
}
