import { GoogleGenerativeAI } from '@google/generative-ai'

// ── Key Management & Rotation ──
const API_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_API_KEY_2
].filter(key => key && key.length > 20 && !key.includes('your_'))

const COOLDOWN_MS = 20000 // Reduced to 20s for faster recovery ⏳
const keyStatus = API_KEYS.map(() => ({ cooldownUntil: 0 }))
let lastUsedIndex = -1

function getAvailableAI() {
  if (API_KEYS.length === 0) throw new Error('API_KEY_MISSING')
  
  const now = Date.now()
  for (let i = 0; i < API_KEYS.length; i++) {
    const nextIdx = (lastUsedIndex + 1 + i) % API_KEYS.length
    if (keyStatus[nextIdx].cooldownUntil < now) {
      lastUsedIndex = nextIdx
      console.log(`📡 Using API Key ${nextIdx + 1}/${API_KEYS.length}`)
      return { 
        instance: new GoogleGenerativeAI(API_KEYS[nextIdx]), 
        index: nextIdx 
      }
    }
  }
  throw new Error('RATE_LIMIT')
}

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

function buildPrompt(userInput) {
  return `Input: ${userInput}

Return a detailed JSON object with EXACTLY these keys and formats:

{
  "disease_name": "Full official name of the disease",
  "overview": "2-3 sentence plain English summary of what this disease is",
  "symptoms": [
    { "name": "Symptom name", "severity": "mild/moderate/severe", "description": "1 line explanation" }
  ],
  "medicines": [
    { "name": "Medicine name", "type": "antibiotic/painkiller/antiviral/etc", "purpose": "what it does", "note": "important warning if any, or empty string" }
  ],
  "what_to_do": [
    "Specific action 1",
    "Specific action 2"
  ],
  "what_not_to_do": [
    "Specific thing to avoid 1",
    "Specific thing to avoid 2"
  ],
  "food_to_eat": [
    { "food": "Food name", "reason": "why it helps recovery" }
  ],
  "food_to_avoid": [
    { "food": "Food name", "reason": "why it is harmful" }
  ],
  "emergency_signs": [
    { "sign": "Danger sign to watch for", "action": "What to do immediately" }
  ],
  "home_remedies": [
    { "remedy": "Remedy name", "how_to_use": "Step by step instruction", "effectiveness": "proven/traditional/anecdotal" }
  ],
  "recovery_timeline": {
    "mild_case": "e.g. 3-5 days",
    "moderate_case": "e.g. 1-2 weeks",
    "severe_case": "e.g. 3-4 weeks",
    "factors": "What affects how fast someone recovers"
  },
  "prevention_tips": [
    { "tip": "Prevention action", "importance": "high/medium/low" }
  ],
  "disclaimer": "This information is for educational purposes only. Always consult a qualified healthcare professional for diagnosis and treatment."
}

Return ONLY valid JSON. No markdown. No code blocks. No extra text.`
}

export async function fetchDiseaseInfo(disease) {
  const PRIMARY_MODEL = 'gemini-2.0-flash' // Updated from legacy flash
  const FALLBACK_MODEL = 'gemini-1.5-flash-latest'

  // 1. Local Storage Cache (🧠 Caching)
  const cacheKey = `mg_${disease.toLowerCase().trim()}`
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) return JSON.parse(cached)
  } catch {}

  // 2. API Call Function
  const callAI = async (modelName) => {
    const { instance, index } = getAvailableAI()
    
    try {
      const model = instance.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: { 
          temperature: 0.2, 
          topP: 0.8, 
          maxOutputTokens: 3000,
          responseMimeType: "application/json"
        },
      })
      
      const result = await model.generateContent(buildPrompt(disease))
      const response = await result.response
      let text = response.text()

      if (!text || text.trim().length === 0) throw new Error('NO_RESPONSE')

      const start = text.indexOf('{')
      const end = text.lastIndexOf('}')
      if (start === -1 || end === -1) throw new Error('NO_JSON_FOUND')
      
      const jsonStr = text.substring(start, end + 1)
      const parsed = JSON.parse(jsonStr)
      
      if (!parsed.error) localStorage.setItem(cacheKey, JSON.stringify(parsed))
      return parsed

    } catch (err) {
      if (err.message?.includes('429')) {
        keyStatus[index].cooldownUntil = Date.now() + COOLDOWN_MS // ⏳ Cooldown
      }
      throw err
    }
  }

  // 3. Retry Logic with Key Swapping
  async function attemptFetch(modelName, retriesLeft = 2) {
    try {
      return await callAI(modelName)
    } catch (err) {
      const isRateLimited = err.message?.includes('429') || err.message?.toLowerCase().includes('quota')
      const isOverloaded = err.message?.includes('503') || err.message?.toLowerCase().includes('high demand')

      if (isRateLimited && retriesLeft > 0) {
        console.warn(`Key rate limit hit. Rotating key and retrying... (${retriesLeft} left)`)
        return attemptFetch(modelName, retriesLeft - 1)
      }

      if (isOverloaded && modelName === PRIMARY_MODEL) {
        return attemptFetch(FALLBACK_MODEL, retriesLeft)
      }

      if (isRateLimited) throw new Error('RATE_LIMIT')
      if (isOverloaded) throw new Error('SYSTEM_OVERLOADED')
      if (err.message?.includes('API_KEY')) throw new Error('API_KEY_INVALID')
      throw new Error(err.message || 'API_ERROR')
    }
  }

  return await attemptFetch(PRIMARY_MODEL)
}

export async function fetchHomeRemedies(query) {
  const prompt = `Provide 6-7 natural home remedies for: "${query}". 
  The input can be in English, Hindi, Gujarati, or Hinglish.
  
  Return ONLY a JSON object with this EXACT structure:
  {
    "condition": "The disease name",
    "remedies": [
      { "name": "Remedy name", "use": "How to use", "benefit": "Why it works" }
    ]
  }
  Return ONLY valid JSON.`

  const callRemedies = async (retriesLeft = 2) => {
    const { instance, index } = getAvailableAI()
    
    try {
      const model = instance.getGenerativeModel({ 
        model: 'gemini-1.5-flash-latest',
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
      })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const start = text.indexOf('{')
      const end = text.lastIndexOf('}')
      if (start === -1 || end === -1) throw new Error("PARSE_ERROR")
      
      const cleanJson = text.substring(start, end + 1)
      return JSON.parse(cleanJson)

    } catch (e) {
      const isRateLimited = e.message?.includes('429') || e.message?.toLowerCase().includes('quota')
      if (isRateLimited) {
        keyStatus[index].cooldownUntil = Date.now() + COOLDOWN_MS
        if (retriesLeft > 0) return callRemedies(retriesLeft - 1)
      }
      throw e
    }
  }

  try {
    return await callRemedies()
  } catch (e) {
    const isRateLimited = e.message?.includes('429') || e.message?.toLowerCase().includes('quota')
    return { error: isRateLimited ? "Too many requests. Please wait a moment." : "AI service is currently busy. Please try later." }
  }
}
