import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'

const app = express()
app.use(cors())
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.post('/api/categorize', async (req, res) => {
  try {
    const { merchant } = req.body
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Categorize this merchant: "${merchant}"

Return ONLY one of these categories:
- groceries
- dining
- transportation
- shopping
- entertainment
- subscriptions
- utilities
- healthcare
- insurance
- other

Return only the category name, nothing else.`
      }],
      temperature: 0.3
    })
    
    const category = completion.choices[0].message.content.trim().toLowerCase()
    res.json({ category })
  } catch (error) {
    console.error('Categorization error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/insights', async (req, res) => {
  try {
    const { prompt } = req.body
    console.log('Received request for insights')
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
    
    const content = completion.choices[0].message.content
    console.log('OpenAI response:', content)
    
    // Try to parse as JSON directly, or extract JSON from markdown
    let result
    try {
      result = JSON.parse(content)
    } catch (e) {
      console.log('Direct parse failed, trying extraction...')
      console.log('Parse error:', e.message)
      console.log('Content that failed:', content.substring(0, 500))
      // Try to extract JSON array
      const arrayMatch = content.match(/\[[\s\S]*\]/)
      if (arrayMatch) {
        result = JSON.parse(arrayMatch[0])
      } else {
        // Try to extract JSON object
        const objectMatch = content.match(/\{[\s\S]*\}/)
        if (objectMatch) {
          result = JSON.parse(objectMatch[0])
        } else {
          throw new Error('Could not extract valid JSON from response')
        }
      }
    }
    
    res.json({ insights: result })
  } catch (error) {
    console.error('Error:', error.message)
    console.error('Full error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(3001, () => console.log('Backend running on http://localhost:3001'))
