import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role, location } = req.body;

  if (!role || !location) {
    return res.status(400).json({ error: 'Role and location are required' });
  }

  try {
    const perPage = 5; // Limit to 5 jobs for chatbot display
    
    // Check if API keys are available
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
      console.error('Missing Adzuna API keys');
      return res.status(500).json({ error: 'API configuration missing' });
    }
    
    // Call Adzuna API
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&results_per_page=${perPage}&what=${encodeURIComponent(role)}&where=${encodeURIComponent(location)}`;
    const adzunaResp = await axios.get(adzunaUrl);
    const adzunaJobs = adzunaResp.data.results.map((j: any) => ({
      title: j.title,
      company: j.company.display_name,
      location: j.location.display_name,
      url: j.redirect_url,
      summary: j.description,
      source: 'Adzuna',
      company_logo: j.company?.logo_url || null,
    }));
    
    // Call Arbeitnow API (no pagination, so filter and slice)
    const arbeitnowUrl = `https://www.arbeitnow.com/api/job-board-api`;
    const arbeitnowResp = await axios.get(arbeitnowUrl);
    const filteredArbeitnowJobs = arbeitnowResp.data.data.filter((j: any) =>
      (j.title.toLowerCase().includes(role.toLowerCase()) &&
       j.location.toLowerCase().includes(location.toLowerCase()))
    );
    // Paginate Arbeitnow results manually
    const pagedArbeitnowJobs = filteredArbeitnowJobs.slice(0, perPage).map((j: any) => ({
      title: j.title,
      company: j.company_name,
      location: j.location,
      url: j.url,
      summary: j.description,
      source: 'Arbeitnow',
      company_logo: null,
    }));
    
    // Combine and return results from both sources
    const combinedJobs = [...adzunaJobs, ...pagedArbeitnowJobs];
    
    // Format the response for chatbot display
    const formattedResponse = {
      type: 'job_search',
      jobs: combinedJobs,
      total: combinedJobs.length,
      searchQuery: { role, location }
    };

    res.status(200).json(formattedResponse);
  } catch (err) {
    console.error('Job search failed:', err);
    res.status(500).json({ error: 'Job search failed' });
  }
}
