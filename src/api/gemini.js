import { GoogleGenerativeAI } from '@google/generative-ai'

// Reads VITE_GEMINI_API_KEY from your .env file automatically
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY)

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
  const PRIMARY_MODEL = 'gemini-1.5-flash'
  const FALLBACK_MODEL = 'gemini-1.5-flash-8b'
  const TERTIARY_MODEL = 'gemini-2.0-flash'

  // 1. Check API key
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') throw new Error('API_KEY_MISSING')

  // 2. Local Storage Cache
  const cacheKey = `mg_${disease.toLowerCase().trim()}`
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) return JSON.parse(cached)
  } catch {}

  // 3. API Call Function
  const callAI = async (modelName) => {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { 
        temperature: 0.2, 
        topP: 0.8, 
        maxOutputTokens: 3000,
        responseMimeType: "application/json" // Force JSON mode
      },
    })
    const result = await model.generateContent(buildPrompt(disease))
    const response = await result.response
    let text = response.text()

    if (!text || text.trim().length === 0) {
      throw new Error('NO_RESPONSE')
    }

    // Robust JSON extraction
    try {
      // Find the first { and the last }
      const start = text.indexOf('{')
      const end = text.lastIndexOf('}')
      if (start === -1 || end === -1) throw new Error('NO_JSON_FOUND')
      
      const jsonStr = text.substring(start, end + 1)
      return JSON.parse(jsonStr)
    } catch (e) {
      console.error('JSON Parse Error. Raw text:', text)
      throw new Error('PARSE_ERROR')
    }
  }

  // 4. Try-Catch with Fallback & Retry
  async function attemptFetch(modelName, retryOnRateLimit = true) {
    try {
      const parsed = await callAI(modelName)
      if (!parsed.error) localStorage.setItem(cacheKey, JSON.stringify(parsed))
      return parsed
    } catch (err) {
      const isRateLimited = err.message?.includes('429') || err.message?.toLowerCase().includes('quota')
      const isOverloaded = err.message?.includes('503') || err.message?.toLowerCase().includes('high demand')

      // Case 1: Rate Limit - Try a small delay and ONE retry with the same model
      if (isRateLimited && retryOnRateLimit) {
        console.warn(`Rate limit hit on ${modelName}. Retrying in 3 seconds...`)
        await new Promise(r => setTimeout(r, 3000))
        return attemptFetch(modelName, false) 
      }

      // Case 2: Overloaded or Rate Limit exhausted - Cascade to next model
      if (isOverloaded || isRateLimited) {
        if (modelName === PRIMARY_MODEL) {
          console.warn(`Switching to Fallback Model (${FALLBACK_MODEL})...`)
          return attemptFetch(FALLBACK_MODEL, true)
        }
        if (modelName === FALLBACK_MODEL) {
          console.warn(`Switching to Tertiary Model (${TERTIARY_MODEL})...`)
          return attemptFetch(TERTIARY_MODEL, true)
        }
      }

      // Case 3: Terminal Errors
      if (isRateLimited) throw new Error('RATE_LIMIT')
      if (isOverloaded) throw new Error('SYSTEM_OVERLOADED')
      if (err.message?.includes('API_KEY')) throw new Error('API_KEY_INVALID')
      
      throw new Error(err.message || 'API_ERROR')
    }
  }

  return await attemptFetch(PRIMARY_MODEL)
}

export async function fetchHomeRemedies(query) {
  // 1. Check API key
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') return { error: "API key is missing. Please check your .env file." }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: { 
      temperature: 0.1, 
      responseMimeType: "application/json" 
    }
  })
  
  const prompt = `Provide 6-7 natural home remedies for: "${query}". 
  The input can be in English, Hindi, Gujarati, or Hinglish.
  
  Return ONLY a JSON object with this EXACT structure:
  {
    "condition": "The disease name",
    "remedies": [
      { "name": "Remedy name", "use": "How to use", "benefit": "Why it works" }
    ]
  }
  
  Keep descriptions simple. Return ONLY valid JSON.`

  const callRemedies = async (retryOnRateLimit = true) => {
    try {
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
      if (isRateLimited && retryOnRateLimit) {
        console.warn('Home Remedies rate limit. Retrying in 2 seconds...')
        await new Promise(r => setTimeout(r, 2000))
        return callRemedies(false)
      }
      throw e
    }
  }

  try {
    return await callRemedies()
  } catch (e) {
    console.error('Home Remedies API Error:', e)
    const isRateLimited = e.message?.includes('429') || e.message?.toLowerCase().includes('quota')
    return { error: isRateLimited ? "Too many requests. Please wait a moment." : "AI service is currently busy. Please try later." }
  }
}
