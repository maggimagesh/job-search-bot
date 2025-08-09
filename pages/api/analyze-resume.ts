import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ error: 'Missing resume text' });

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

    const pplxResp = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-pro',
        messages: [{ role: 'user', content: prompt }],
      },
      { headers: { Authorization: `Bearer ${process.env.PPLX_API_KEY}` } }
    );

    const jsonString = pplxResp.data.choices?.[0]?.message?.content;
    const analysis = JSON.parse(jsonString);

    res.status(200).json({ analysis }); // Jobs fetched separately in search-jobs API
  } catch (err: any) {
    if (err.response) {
      console.error('Perplexity API error response:', err.response.data);
    }
    console.error(err);
    res.status(err.response?.status || 500).json({
      error: err.message || 'Server error',
      details: err.response?.data || null
    });
  }
}
