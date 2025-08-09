import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { role, location, page = '1' } = req.query;
    const perPage = 10;  // Jobs per page
    
    // Call Adzuna API
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&results_per_page=${perPage}&what=${encodeURIComponent(role as string)}&where=${encodeURIComponent(location as string)}`;
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
      (j.title.toLowerCase().includes((role as string).toLowerCase()) &&
       j.location.toLowerCase().includes((location as string).toLowerCase()))
    );
    // Paginate Arbeitnow results manually
    const offset = (Number(page) - 1) * perPage;
    const pagedArbeitnowJobs = filteredArbeitnowJobs.slice(offset, offset + perPage).map((j: any) => ({
      title: j.title,
      company: j.company_name,
      location: j.location,
      url: j.url,
      summary: j.description,
      source: 'Arbeitnow',
      company_logo: null,
    }));
    
    // Combine and return results from both sources (simple concatenation)
    const combinedJobs = [...adzunaJobs, ...pagedArbeitnowJobs];
    
    // For real pagination, you could add total count & more metadata here
    res.status(200).json({ jobs: combinedJobs });
  } catch (err) {
    console.error('Job fetch failed:', err);
    res.status(500).json({ error: 'Job fetch failed' });
  }
}
