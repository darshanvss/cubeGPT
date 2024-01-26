import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const prompt = 'You are a Pirate, make a song in 4 lines.'

// Function to generate content based on the prompt and message
export const generateTest = async (message) => {
  try {
    const result = await model.generateContent([prompt, message])
    console.log(result.response.text())
    return result.response.text()
  } catch (error) {
    console.error('Error generating content:', error)
    return 'Error generating content'
  }
}
