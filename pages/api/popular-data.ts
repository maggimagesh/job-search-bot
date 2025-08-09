import type { NextApiRequest, NextApiResponse } from 'next';

type PopularData = {
  popularRoles: string[];
  trendingLocations: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pplxApiKey = process.env.PPLX_API_KEY;
  const fallbackData: PopularData = {
    popularRoles: [
      'Java Full Stack Developer',
      'Frontend Developer',
      'Data Scientist',
      'Product Manager',
      'UX Designer',
      'DevOps Engineer',
    ],
    trendingLocations: [
      'Chennai',
      'Bangalore',
      'Mumbai',
      'Delhi',
      'Hyderabad',
      'Pune',
    ],
  };

  if (!pplxApiKey) {
    return res.status(200).json(fallbackData);
  }

  try {
    const prompt = `Generate exactly 6 popular job roles and 6 trending locations for job search in India. 
Return only JSON: 
{"popularRoles": ["role1", "role2", "role3", "role4", "role5", "role6"], 
"trendingLocations": ["location1", "location2", "location3", "location4", "location5", "location6"]}`;

    const models = ['sonar-pro', 'sonar-medium-chat', 'sonar-small-chat'];
    let content: string | null = null;

    for (const model of models) {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pplxApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        content = data.choices?.[0]?.message?.content;
        if (content) break;
      }
    }

    if (!content) return res.status(200).json(fallbackData);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(200).json(fallbackData);

    const parsed: PopularData = JSON.parse(jsonMatch[0]);

    return res.status(200).json({
      popularRoles: parsed.popularRoles.slice(0, 6),
      trendingLocations: parsed.trendingLocations.slice(0, 6),
    });
  } catch {
    return res.status(200).json(fallbackData);
  }
}
