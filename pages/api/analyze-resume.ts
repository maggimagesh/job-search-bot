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

    const xaiResp = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-3',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      },
      { headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}` } }
    );

    const jsonString = xaiResp.data.choices?.[0]?.message?.content;
    const analysis = JSON.parse(jsonString);

    res.status(200).json({ analysis }); // Jobs fetched separately in search-jobs API
  } catch (err: any) {
    console.error(err);
    res.status(err.response?.status || 500).json({ error: err.message || 'Server error' });
  }
}
