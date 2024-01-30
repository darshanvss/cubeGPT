import axios from 'axios'
import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const prompt = `You are an expert at converting English sentences into SQL Queries. The Database has
a table named "Results" with the following columns: id,pos,personId,personName,countryId,competitionId,
eventId,roundTypeId,formatId,value1,value2,value3,value4,value5,best,average,regionalSingleRecord,
regionalAverageRecord,updated_at. Only give the SQL Command and nothing else, not even the ''' quotes it is wrapped in.
`
const tableContext = `
Values of the 'Results' table can be interpreted as follows:

- The result values are in the following fields 'value1', 'value2', 'value3', 'value4', 'value5',
  'best', and 'average'.
- The value '-1' means DNF (Did Not Finish).
- The value '-2' means DNS (Did Not Start).
-The value '0' means 'no result'.

All sql queries should not include DNF ,DNS and no results by default untill and unless specified
`

const eventContext = `
these are the ppossible eventId's 222, 333, 333bf, 333fm, 333ft, 333mbf, 333mbo, 333oh, 444,
 444bf, 555, 555bf, 666, 777, clock, magic, minx, mmagic, pyram, skewb, sq1.
 and their names can be as follows 2x2x2 Cube, 3x3x3 Cube, 3x3x3 Blindfolded, 3x3x3 Fewest Moves, 
 3x3x3 With Feet, 3x3x3 Multi-Blind, 3x3x3 Multi-Blind Old Style, 3x3x3 One-Handed, 4x4x4 Cube,
  4x4x4 Blindfolded, 5x5x5 Cube, 5x5x5 Blindfolded, 6x6x6 Cube, 7x7x7 Cube, Clock, Magic, Megaminx,
   Master Magic, Pyraminx, Skewb, Square-1

`
const examples = `
here are some reference examples:

Give all sub 1 2x2 solves

select * from Results r where 
      ((value1 BETWEEN 1 AND 100) OR
      (value2 BETWEEN 1 AND 100) OR
      (value3 BETWEEN 1 AND 100) OR
      (value4 BETWEEN 1 AND 100) OR
      (value5 BETWEEN 1 AND 100))
and eventId='222' 
order by best asc

what are the top 1000 3x3 solves

SELECT 
  personName as 'Person',
  CASE WHEN value1 = -1 THEN 'DNF' ELSE value1 END as 'Solve 1',
  CASE WHEN value2 = -1 THEN 'DNF' ELSE value2 END as 'Solve 2',
  CASE WHEN value3 = -1 THEN 'DNF' ELSE value3 END as 'Solve 3',
  CASE WHEN value4 = -1 THEN 'DNF' ELSE value4 END as 'Solve 4',
  CASE WHEN value5 = -1 THEN 'DNF' ELSE value5 END as 'Solve 5',
  best as 'Fastest Solve',
  countryID
FROM Results r
WHERE eventId='333'
  AND (value1 > 1 OR value2 > 1 OR value3 > 1 OR value4 > 1 OR value5 > 1)
ORDER BY best ASC
LIMIT 1000;

`

// Function to generate content based on the prompt and message
export const generateTest = async (message) => {
  try {
    const result = await model.generateContent([
      prompt,
      tableContext,
      eventContext,
      examples,
      message
    ])
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
