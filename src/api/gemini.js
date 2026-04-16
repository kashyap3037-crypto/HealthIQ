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
  const PRIMARY_MODEL = 'gemini-3-flash-preview'
  const FALLBACK_MODEL = 'gemini-2.0-flash'

  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') throw new Error('API_KEY_MISSING')

  const cacheKey = `mg_${disease.toLowerCase().trim()}`
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) return JSON.parse(cached)
  } catch {}

  const callAI = async (modelName) => {
    const model = genAI.getGenerativeModel({
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

    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('NO_JSON_FOUND')
    return JSON.parse(text.substring(start, end + 1))
  }

  try {
    const parsed = await callAI(PRIMARY_MODEL)
    if (!parsed.error) localStorage.setItem(cacheKey, JSON.stringify(parsed))
    return parsed
  } catch (err) {
    const isOverloaded = err.message?.includes('503') || err.message?.toLowerCase().includes('high demand')
    if (isOverloaded) {
      try {
        const fallbackParsed = await callAI(FALLBACK_MODEL)
        if (!fallbackParsed.error) localStorage.setItem(cacheKey, JSON.stringify(fallbackParsed))
        return fallbackParsed
      } catch (fallbackErr) {
        throw new Error('SYSTEM_OVERLOADED')
      }
    }
    if (err.message?.includes('API_KEY')) throw new Error('API_KEY_INVALID')
    if (err.message?.includes('429')) throw new Error('RATE_LIMIT')
    throw new Error(err.message || 'API_ERROR')
  }
}

export async function fetchHomeRemedies(query) {
  const PRIMARY = 'gemini-3-flash-preview'
  const FALLBACK = 'gemini-2.0-flash'
  
  const prompt = `You are a home remedy expert. Provide exactly 6-7 natural home remedies for: "${query}".
  Target symptoms or disease in English, Hindi, Gujarati, Hinglish, or Gujlish.
  Output in valid JSON:
  {
    "condition": "The interpreted condition",
    "remedies": [
      { "name": "Remedy Name", "use": "Detailed but simple instructions in English", "benefit": "Brief benefit" }
    ]
  }
  Use simple English. No markdown.`

  const callRemedyAI = async (modelName) => {
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: { responseMimeType: "application/json" }
    })
    const result = await model.generateContent(prompt)
    const text = (await result.response).text()
    
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1) throw new Error("NO_JSON")
    return JSON.parse(text.substring(start, end + 1))
  }

  try {
    return await callRemedyAI(PRIMARY)
  } catch (err) {
    console.error('Home Remedies Error (Primary):', err)
    try {
      return await callRemedyAI(FALLBACK)
    } catch (fallbackErr) {
      console.error('Home Remedies Error (Fallback):', fallbackErr)
      return { error: "Our remedies search is currently busy. Please wait 30 seconds and try again." }
    }
  }
}
