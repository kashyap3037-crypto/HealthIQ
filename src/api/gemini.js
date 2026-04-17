import { GoogleGenerativeAI } from '@google/generative-ai'

// --- Configuration ---
const SYSTEM_PROMPT = `You are HealthIQ, an expert medical information assistant.
You specialize in analyzing symptoms and medical conditions provided in multiple languages including English, Hindi, Gujarati, and mixed-language inputs (Hinglish/Gujlish).

Your job is to:
1. Interpret the input (whether it's a specific disease name or a description of symptoms).
2. If symptoms are provided, map them to the most likely medical condition.
3. Provide accurate, well-structured, and easy-to-understand medical information for that condition.

STRICT RULES:
- Always respond in valid JSON only.
- Support all input languages: English, Hindi, Gujarati, Hinglish, Gujlish.
- If the input is symptoms, treat them as the primary context for the "disease_name" and details.
- Be specific — avoid vague answers — be precise.
- Use simple English in the JSON output fields.
- If the input is completely unrecognizable or non-medical, return: {"error": "Input not recognized as a medical condition or symptoms. Please try again."}
- Always include a disclaimer field in every response.`

const PROVIDERS = [
  { 
    id: 'GEMINI_1', 
    type: 'gemini', 
    apiKey: import.meta.env.VITE_GEMINI_API_KEY, 
    model: 'gemini-1.5-flash' 
  },
  { 
    id: 'GEMINI_2', 
    type: 'gemini', 
    apiKey: import.meta.env.VITE_GEMINI_API_KEY_2, 
    model: 'gemini-1.5-flash' 
  },
  { 
    id: 'GROQ_1', 
    type: 'groq', 
    apiKey: import.meta.env.VITE_GROQ_API_KEY, 
    model: 'llama-3.3-70b-versatile' 
  }
];

// --- Cooldown & Rotation Management ---
const COOLDOWN_MS = 60 * 1000; // 1 minute cooldown

function getCooldowns() {
  try {
    return JSON.parse(localStorage.getItem('hiq_cooldowns') || '{}');
  } catch { return {}; }
}

function setCooldown(providerId) {
  const cooldowns = getCooldowns();
  cooldowns[providerId] = Date.now() + COOLDOWN_MS;
  localStorage.setItem('hiq_cooldowns', JSON.stringify(cooldowns));
}

function getNextProviderIndex() {
  const current = parseInt(localStorage.getItem('hiq_provider_idx') || '0');
  return current % PROVIDERS.length;
}

function incrementProviderIndex() {
  const current = parseInt(localStorage.getItem('hiq_provider_idx') || '0');
  localStorage.setItem('hiq_provider_idx', (current + 1) % PROVIDERS.length);
}

// --- API Calls ---

async function callGemini(provider, prompt, systemInstruction) {
  const genAI = new GoogleGenerativeAI(provider.apiKey);
  const model = genAI.getGenerativeModel({
    model: provider.model,
    systemInstruction,
    generationConfig: { 
      temperature: 0.2, 
      maxOutputTokens: 3000,
      responseMimeType: "application/json"
    },
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function callGroq(provider, prompt, systemInstruction) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: provider.model,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const status = response.status;
    if (status === 429) throw new Error('RATE_LIMIT');
    throw new Error(errorData.error?.message || 'GROQ_ERROR');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// --- Main Service Logic ---

export async function fetchDiseaseInfo(disease) {
  const cacheKey = `mg_${disease.toLowerCase().trim()}`;
  
  // 1. Cache Check
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {}

  const prompt = `Input: ${disease} - Return full clinical JSON object. (Follow all previously established keys)`;
  // Note: For brevity in this call, I'm assuming the system instruction handles the keys, 
  // but to be safe I'll use a shortened version of buildPrompt if needed.
  // Actually, I'll use the FULL prompt logic to be safe.
  const fullPrompt = `Input: ${disease}

Return a detailed JSON object with EXACTLY these keys and formats:
{
  "disease_name": "Full official name",
  "overview": "Summary",
  "symptoms": [{ "name": "...", "severity": "...", "description": "..." }],
  "medicines": [{ "name": "...", "type": "...", "purpose": "...", "note": "..." }],
  "what_to_do": ["..."],
  "what_not_to_do": ["..."],
  "food_to_eat": [{ "food": "...", "reason": "..." }],
  "food_to_avoid": [{ "food": "...", "reason": "..." }],
  "emergency_signs": [{ "sign": "...", "action": "..." }],
  "home_remedies": [{ "remedy": "...", "how_to_use": "...", "effectiveness": "..." }],
  "recovery_timeline": { "mild_case": "...", "moderate_case": "...", "severe_case": "...", "factors": "..." },
  "prevention_tips": [{ "tip": "...", "importance": "..." }],
  "disclaimer": "..."
}
Return valid JSON only.`;

  const cooldowns = getCooldowns();
  let startIndex = getNextProviderIndex();
  let lastError = null;

  // 2. Rotation & Fallback Loop
  for (let i = 0; i < PROVIDERS.length; i++) {
    const idx = (startIndex + i) % PROVIDERS.length;
    const provider = PROVIDERS[idx];

    // Check Cooldown
    if (cooldowns[provider.id] && cooldowns[provider.id] > Date.now()) {
      console.warn(`Skipping ${provider.id} - on cooldown.`);
      continue;
    }

    // Check API Key Presence
    if (!provider.apiKey || provider.apiKey.includes('placeholder')) {
       console.warn(`Skipping ${provider.id} - Missing API Key.`);
       continue;
    }

    try {
      console.log(`Attempting with ${provider.id} (${provider.type})...`);
      let text = '';
      if (provider.type === 'gemini') {
        text = await callGemini(provider, fullPrompt, SYSTEM_PROMPT);
      } else {
        text = await callGroq(provider, fullPrompt, SYSTEM_PROMPT);
      }

      // Extract & Parse JSON
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error('PARSE_ERROR');
      
      const parsed = JSON.parse(text.substring(start, end + 1));
      
      // Success! Update rotation and cache
      incrementProviderIndex();
      if (!parsed.error) localStorage.setItem(cacheKey, JSON.stringify(parsed));
      return parsed;

    } catch (err) {
      console.error(`${provider.id} failed:`, err.message);
      lastError = err;

      const isRateLimited = err.message?.includes('429') || err.message?.toLowerCase().includes('quota') || err.message?.includes('RATE_LIMIT');
      if (isRateLimited) {
        setCooldown(provider.id);
      }
      // Continue to next provider...
    }
  }

  // If we reach here, all providers failed
  if (lastError?.message?.includes('RATE_LIMIT') || lastError?.message?.toLowerCase().includes('quota')) {
    throw new Error('RATE_LIMIT');
  }
  throw new Error(lastError?.message || 'API_ERROR');
}

export async function fetchHomeRemedies(query) {
  const prompt = `Provide 6-7 natural home remedies for: "${query}". 
  Return ONLY a JSON object with this structure: { "condition": "...", "remedies": [{ "name": "...", "use": "...", "benefit": "..." }] }`;

  const cooldowns = getCooldowns();
  let startIndex = getNextProviderIndex();
  
  for (let i = 0; i < PROVIDERS.length; i++) {
    const idx = (startIndex + i) % PROVIDERS.length;
    const provider = PROVIDERS[idx];

    if (cooldowns[provider.id] && cooldowns[provider.id] > Date.now()) continue;
    if (!provider.apiKey || provider.apiKey.includes('placeholder')) continue;

    try {
      let text = '';
      if (provider.type === 'gemini') {
        text = await callGemini(provider, prompt, "You are a home remedy expert. Return valid JSON only.");
      } else {
        text = await callGroq(provider, prompt, "You are a home remedy expert. Return valid JSON only.");
      }

      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error('PARSE_ERROR');
      return JSON.parse(text.substring(start, end + 1));

    } catch (err) {
      console.error(`${provider.id} (Remedies) failed:`, err.message);
      const isRateLimited = err.message?.includes('429') || err.message?.toLowerCase().includes('quota') || err.message?.includes('RATE_LIMIT');
      if (isRateLimited) setCooldown(provider.id);
    }
  }

  return { error: "AI service is currently busy. Please try again in 1 minute." };
}
