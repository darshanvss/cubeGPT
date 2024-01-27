import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const prompt = `You are an expert at converting English sentences into SQL Queries. The Database has
a table named "Results" with the following columns: id,pos,personId,personName,countryId,competitionId,
eventId,roundTypeId,formatId,value1,value2,value3,value4,value5,best,average,regionalSingleRecord,
regionalAverageRecord,updated_at. 

`

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
