import axios from 'axios'
import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const prompt = `You are an expert at converting English sentences into SQL Queries. The Database has
a table named "Results" with the following columns: id,pos,personId,personName,countryId,competitionId,
eventId,roundTypeId,formatId,value1,value2,value3,value4,value5,best,average,regionalSingleRecord,
regionalAverageRecord,updated_at. Only give the SQL Command and nothing else, not even the ''' quotes it is wrapped in.

`

// Function to generate content based on the prompt and message
export const generateTest = async (message) => {
  try {
    const result = await model.generateContent([prompt, message])
    const sqlQuery = result.response.text()
    // Check if the generated text is a valid SQL statement
    console.log(sqlQuery)
    const wcaResponse = await queryWca(sqlQuery)
    console.log('wcaResponse', wcaResponse)
    return wcaResponse
  } catch (error) {
    console.error('Error generating content:', error)
    return 'Error generating content'
  }
}

async function queryWca(sqlQuery, page = 0, size = 20) {
  const url = 'https://statistics-api.worldcubeassociation.org/database/query'

  const accessToken = localStorage.getItem('access_token')
  const tokenType = localStorage.getItem('token_type')

  try {
    const response = await axios.post(
      url,
      {
        sqlQuery,
        page,
        size
      },
      {
        headers: {
          Authorization: `${tokenType} ${accessToken}`
        }
      }
    )

    // Handle the response as needed
    console.log('Response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error // Rethrow the error to handle it in the calling code
  }
}
