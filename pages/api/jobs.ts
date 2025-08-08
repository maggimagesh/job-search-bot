import type { NextApiRequest, NextApiResponse } from 'next'

type PortalLink = { name: string; url: string; note?: string }
type JobItem = { title: string; company?: string; location?: string; url?: string }

const portals: { name: string; build: (role: string, loc: string)=>string }[] = [
  { name: 'Naukri', build: (r,l) => `https://www.naukri.com/${encodeURIComponent(r)}-jobs-in-${encodeURIComponent(l)}` },
  { name: 'Indeed', build: (r,l) => `https://in.indeed.com/jobs?q=${encodeURIComponent(r)}&l=${encodeURIComponent(l)}` },
  { name: 'LinkedIn', build: (r,l) => `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(r)}&location=${encodeURIComponent(l)}` },
  { name: 'Glassdoor', build: (r,l) => `https://www.glassdoor.co.in/Job/${encodeURIComponent(l)}-${encodeURIComponent(r)}-jobs-SRCH_IL.0,${encodeURIComponent(l.length)}.htm` }
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const role = (req.query.role || '').toString().trim()
  const location = (req.query.location || '').toString().trim()
  if (!role || !location) return res.status(400).json({ error: 'role and location required' })

  const links: PortalLink[] = portals.map(p => ({ name: p.name, url: p.build(role, location), note: 'Search results page' }))

  // Optional: call Adzuna for structured results (if ADZUNA_APP_ID and ADZUNA_APP_KEY set)
  const adzunaId = process.env.ADZUNA_APP_ID
  const adzunaKey = process.env.ADZUNA_APP_KEY
  let adzunaJobs: JobItem[] = []
  if (adzunaId && adzunaKey) {
    try {
      const q = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${adzunaId}&app_key=${adzunaKey}&what=${encodeURIComponent(role)}&where=${encodeURIComponent(location)}&results_per_page=10`
      const r = await fetch(q)
      const j = await r.json()
      adzunaJobs = (j.results || []).map((x: any) => ({
        title: x.title,
        company: x.company?.display_name,
        location: x.location?.display_name,
        url: x.redirect_url || x.redirect_url
      }))
    } catch (e) {
      console.error('Adzuna fetch error', e)
    }
  }

  return res.status(200).json({ portals: links, jobs_from_adzuna: adzunaJobs })
}
