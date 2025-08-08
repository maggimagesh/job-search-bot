import type { NextApiRequest, NextApiResponse } from 'next'

type PopularData = {
  popularRoles: string[]
  trendingLocations: string[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check if xAI API key is configured
    const xaiApiKey = process.env.XAI_API_KEY
    if (!xaiApiKey) {
      // Fallback to static data if xAI is not configured
      const fallbackData: PopularData = {
        popularRoles: [
          'Java Full Stack Developer',
          'Frontend Developer', 
          'Data Scientist',
          'Product Manager',
          'UX Designer',
          'DevOps Engineer',
          'React Developer',
          'Python Developer',
          'Mobile App Developer',
          'Cloud Engineer'
        ],
        trendingLocations: [
          'Chennai',
          'Bangalore', 
          'Mumbai',
          'Delhi',
          'Hyderabad',
          'Pune',
          'Gurgaon',
          'Noida',
          'Kolkata',
          'Ahmedabad'
        ]
      }
      return res.status(200).json(fallbackData)
    }

    // Use xAI to generate dynamic popular jobs and locations
    const prompt = `Generate 6 popular job roles and 6 trending locations for job search in India. Return only JSON: {"popularRoles": ["role1", "role2", "role3", "role4", "role5", "role6"], "trendingLocations": ["location1", "location2", "location3", "location4", "location5", "location6"]}`

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${xaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
        reasoning: false
      })
    })

    if (!response.ok) {
      throw new Error(`xAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content received from xAI')
    }

    // Parse the JSON response from xAI
    let parsedData: PopularData
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse xAI response:', content)
      throw new Error('Invalid response format from xAI')
    }

    // Validate the response structure
    if (!parsedData.popularRoles || !parsedData.trendingLocations) {
      throw new Error('Invalid response structure from xAI')
    }

    // Ensure we have arrays of strings
    if (!Array.isArray(parsedData.popularRoles) || !Array.isArray(parsedData.trendingLocations)) {
      throw new Error('Response arrays are not in expected format')
    }

    // Limit to 6 items each for UI consistency
    const result: PopularData = {
      popularRoles: parsedData.popularRoles.slice(0, 6),
      trendingLocations: parsedData.trendingLocations.slice(0, 6)
    }

    return res.status(200).json(result)

  } catch (error) {
    console.error('Error fetching popular data:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    
    // Return fallback data on error
    const fallbackData: PopularData = {
      popularRoles: [
        'Java Full Stack Developer',
        'Frontend Developer',
        'Data Scientist',
        'Product Manager',
        'UX Designer',
        'DevOps Engineer'
      ],
      trendingLocations: [
        'Chennai',
        'Bangalore',
        'Mumbai',
        'Delhi',
        'Hyderabad',
        'Pune'
      ]
    }
    
    return res.status(200).json(fallbackData)
  }
}
