import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pplxApiKey = process.env.PPLX_API_KEY;
  if (!pplxApiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing API key' });
  }

  const { resumeText } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: 'Missing resume text' });
  }

  const prompt = `
Analyze the following resume and return JSON ONLY:
{
  "bestRole": "...",
  "bestLocation": "...",
  "topSkills": ["...", "..."]
}
Resume:
"""${resumeText}"""
`;

  const models = ['sonar-pro', 'sonar-medium-chat', 'sonar-small-chat'];

  try {
    for (const model of models) {
      try {
        const pplxResp = await axios.post(
          'https://api.perplexity.ai/chat/completions',
          {
            model,
            messages: [{ role: 'user', content: prompt }],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${pplxApiKey}`,
            },
          }
        );

        const jsonString = pplxResp.data.choices?.[0]?.message?.content;
        const jsonMatch = jsonString?.match(/\{[\s\S]*\}/);
        if (!jsonMatch) continue;

        const analysis = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ analysis });
      } catch (err: any) {
        const errorMessage = err.response?.data || err.message || 'Unknown error';
        console.error(`Model ${model} failed:`, errorMessage);
        // If it's a 400 error, return the actual Perplexity message
        if (err.response?.status === 400) {
          return res.status(400).json({
            error: 'Bad Request from Perplexity',
            details: errorMessage,
          });
        }
      }
    }

    return res.status(500).json({ error: 'All AI models failed to return valid JSON' });
  } catch (err: any) {
    const errorMessage = err.response?.data || err.message || 'Unknown server error';
    console.error('Unexpected server error:', errorMessage);
    return res.status(500).json({ error: errorMessage });
  }
}
