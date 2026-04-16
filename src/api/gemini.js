import { GoogleGenerativeAI } from '@google/generative-ai'

// Reads VITE_GEMINI_API_KEY from your .env file automatically
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY)

const SYSTEM_PROMPT = `You are HealthIQ, an expert medical information assistant trained on clinical guidelines, pharmacology, and preventive medicine.

Your job is to provide accurate, well-structured, and easy-to-understand medical information when given a disease or medical condition name.

STRICT RULES:
- Always respond in valid JSON only — no markdown, no explanation, no extra text before or after the JSON
- Be specific — avoid vague answers like "eat healthy" — be precise
- Use simple English that a non-medical person can understand
- If the disease is not recognized, return exactly: {"error": "Disease not recognized. Please check spelling or try a different name."}
- Always include a disclaimer field in every response`

function buildPrompt(disease) {
  return `Disease: ${disease}

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
  const PRIMARY_MODEL = 'gemini-3-flash-preview'
  const FALLBACK_MODEL = 'gemini-2.0-flash'

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

  // 4. Try-Catch with Fallback
  try {
    // Attempt with Primary Model
    const parsed = await callAI(PRIMARY_MODEL)
    if (!parsed.error) localStorage.setItem(cacheKey, JSON.stringify(parsed))
    return parsed
  } catch (err) {
    const isOverloaded = err.message?.includes('503') || err.message?.toLowerCase().includes('high demand')
    
    if (isOverloaded) {
      console.warn(`Primary model (${PRIMARY_MODEL}) overloaded. Attempting fallback to ${FALLBACK_MODEL}...`)
      try {
        const fallbackParsed = await callAI(FALLBACK_MODEL)
        if (!fallbackParsed.error) localStorage.setItem(cacheKey, JSON.stringify(fallbackParsed))
        return fallbackParsed
      } catch (fallbackErr) {
        throw new Error('SYSTEM_OVERLOADED') // Both models failing
      }
    }

    if (err.message?.includes('API_KEY')) throw new Error('API_KEY_INVALID')
    if (err.message?.includes('429')) throw new Error('RATE_LIMIT')
    throw new Error(err.message || 'API_ERROR')
  }
}
