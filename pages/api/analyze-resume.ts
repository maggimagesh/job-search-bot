import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Debug log — check if env var is loaded in Vercel
    console.log("PPLX_API_KEY exists:", !!process.env.PPLX_API_KEY);

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
    let lastError: any = null;

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
              Authorization: `Bearer ${process.env.PPLX_API_KEY}`,
            },
          }
        );

        const jsonString = pplxResp.data.choices?.[0]?.message?.content;
        let analysis;
        try {
          analysis = JSON.parse(jsonString);
        } catch {
          console.error('Failed to parse JSON from Perplexity:', jsonString);
          throw new Error('Invalid JSON returned from Perplexity');
        }

        return res.status(200).json({ analysis });

      } catch (err: any) {
        lastError = err;
        if (err.response) {
          console.error(`Perplexity API error for model '${model}':`, err.response.data);
        } else {
          console.error(`Error for model '${model}':`, err.message);
        }
      }
    }

    // If all models fail
    if (lastError) throw lastError;

  } catch (err: any) {
    console.error('Final error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.message || 'Server error',
      details: err.response?.data || null,
    });
  }
}
