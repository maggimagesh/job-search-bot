import type { NextApiRequest, NextApiResponse } from 'next';

type PopularData = {
  popularRoles: string[];
  trendingLocations: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Debug log to check if the env var is loaded in production
    console.log("PPLX_API_KEY exists:", !!process.env.PPLX_API_KEY);

    const pplxApiKey = process.env.PPLX_API_KEY;

    if (!pplxApiKey) {
      // Return fallback data if API key is not configured
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
      };
      return res.status(200).json(fallbackData);
    }

    // Prompt for Perplexity AI
    const prompt = `Generate 6 popular job roles and 6 trending locations for job search in India. Return only JSON: {"popularRoles": ["role1", "role2", "role3", "role4", "role5", "role6"], "trendingLocations": ["location1", "location2", "location3", "location4", "location5", "location6"]}`;

    const models = ['sonar-pro', 'sonar-medium-chat', 'sonar-small-chat'];
    let lastError: any = null;
    let content: string | null = null;

    for (const model of models) {
      try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${pplxApiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'user', content: prompt }
            ]
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error(`Perplexity API error for model '${model}':`, errText);
          throw new Error(`Perplexity AI API error: ${response.status}`);
        }

        const data = await response.json();
        content = data.choices?.[0]?.message?.content;
        if (content) break; // Exit loop if we have a response

      } catch (err) {
        lastError = err;
        console.error(`Error for model '${model}':`, err);
      }
    }

    if (!content) {
      throw lastError || new Error('No content received from Perplexity AI');
    }

    // Parse the JSON response safely
    let parsedData: PopularData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Perplexity AI response:', content);
      throw new Error('Invalid response format from Perplexity AI');
    }

    // Validate structure
    if (
      !parsedData.popularRoles || 
      !parsedData.trendingLocations ||
      !Array.isArray(parsedData.popularRoles) ||
      !Array.isArray(parsedData.trendingLocations)
    ) {
      throw new Error('Invalid response structure from Perplexity AI');
    }

    // Limit to 6 items each
    const result: PopularData = {
      popularRoles: parsedData.popularRoles.slice(0, 6),
      trendingLocations: parsedData.trendingLocations.slice(0, 6)
    };

    return res.status(200).json(result);

  } catch (error: any) {
    console.error('Error fetching popular data:', error);

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
    };
    
    return res.status(200).json(fallbackData);
  }
}
