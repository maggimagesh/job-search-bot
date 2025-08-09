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
    // Check if Perplexity AI API key is configured
    const pplxApiKey = process.env.PPLX_API_KEY
    if (!pplxApiKey) {
      // Fallback to static data if Perplexity AI is not configured
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

    // Use Perplexity AI to generate dynamic popular jobs and locations
    const prompt = `Generate 6 popular job roles and 6 trending locations for job search in India. Return only JSON: {"popularRoles": ["role1", "role2", "role3", "role4", "role5", "role6"], "trendingLocations": ["location1", "location2", "location3", "location4", "location5", "location6"]}`

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pplxApiKey}`,
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Perplexity AI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content received from Perplexity AI')
    }

    // Parse the JSON response from Perplexity AI
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
      console.error('Failed to parse Perplexity AI response:', content)
      throw new Error('Invalid response format from Perplexity AI')
    }

    // Validate the response structure
    if (!parsedData.popularRoles || !parsedData.trendingLocations) {
      throw new Error('Invalid response structure from Perplexity AI')
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
