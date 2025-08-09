import type { NextApiRequest, NextApiResponse } from 'next'

type PortalLink = { name: string; url: string; note?: string }
type JobItem = { title: string; company?: string; location?: string; url?: string }

// Fallback portals if xAI is not available
const fallbackPortals: { name: string; build: (role: string, loc: string)=>string }[] = [
  { name: 'Naukri', build: (r,l) => `https://www.naukri.com/${encodeURIComponent(r)}-jobs-in-${encodeURIComponent(l)}` },
  { name: 'Indeed', build: (r,l) => `https://in.indeed.com/jobs?q=${encodeURIComponent(r)}&l=${encodeURIComponent(l)}` },
  { name: 'LinkedIn', build: (r,l) => `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(r)}&location=${encodeURIComponent(l)}` },
  { name: 'Glassdoor', build: (r,l) => `https://www.glassdoor.co.in/Job/${encodeURIComponent(l)}-${encodeURIComponent(r)}-jobs-SRCH_IL.0,${encodeURIComponent(l.length)}.htm` }
]

// Portal URL builders
const portalBuilders: { [key: string]: (role: string, location: string) => string } = {
  'Naukri': (r, l) => `https://www.naukri.com/${encodeURIComponent(r)}-jobs-in-${encodeURIComponent(l)}`,
  'Indeed': (r, l) => `https://in.indeed.com/jobs?q=${encodeURIComponent(r)}&l=${encodeURIComponent(l)}`,
  'LinkedIn': (r, l) => `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(r)}&location=${encodeURIComponent(l)}`,
  'Glassdoor': (r, l) => `https://www.glassdoor.co.in/Job/${encodeURIComponent(l)}-${encodeURIComponent(r)}-jobs-SRCH_IL.0,${encodeURIComponent(l.length)}.htm`,
  'Found It': (r, l) => `https://www.foundit.in/srp/results?query=${encodeURIComponent(`"${r}"`)}&locations=${encodeURIComponent(l)}&queryEntity=${encodeURIComponent(r.toLowerCase().replace(/\s+/g, '+') + ':designation')}`,
  'TimesJobs': (r, l) => `https://www.timesjobs.com/jobsearch.html?searchType=personalizedSearch&from=submit&txtKeywords=${encodeURIComponent(r)}&txtLocation=${encodeURIComponent(l)}`,
  'Shine': (r, l) => `https://www.shine.com/job-search/${encodeURIComponent(r)}-jobs-in-${encodeURIComponent(l)}`,
  'HackerRank': (r, l) => `https://www.hackerrank.com/apply?roles=${encodeURIComponent(`["${r}"]`)}&countries=${encodeURIComponent(`["${l}"]`)}`,
  'Upwork': (r, l) => `https://www.upwork.com/nx/search/jobs/?nbs=1&q=${encodeURIComponent(r)}`,
  'Freelancer': (r, l) => `https://www.freelancer.com/jobs/?keyword=${encodeURIComponent(r)}&location=${encodeURIComponent(l)}`
}

async function getDynamicPortals(role: string, location: string): Promise<PortalLink[]> {
  const xaiApiKey = process.env.XAI_API_KEY
  
  if (!xaiApiKey) {
    // Fallback to static portals if xAI is not configured
    return fallbackPortals.map(p => ({ 
      name: p.name, 
      url: p.build(role, location), 
      note: 'Search results page' 
    }))
  }
  
  try {
    const prompt = `Based on the job role "${role}" and location "${location}", determine the 5-6 most relevant job portals for this search. Consider factors like:
1. Market popularity and usage in ${location}
2. Industry relevance for ${role}
3. Local job market presence
4. User base and job posting volume
5. Specialized portals for this type of role

Available portals: ${Object.keys(portalBuilders).join(', ')}

For a ${role} in ${location}, return 5-6 most relevant portals as a JSON array. Be diverse and consider specialized portals:
["Portal1", "Portal2", "Portal3", "Portal4", "Portal5"]`

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${xaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
        reasoning: false
      })
    })

    if (!response.ok) {
      console.error(`xAI API error: ${response.status} - ${response.statusText}`)
      throw new Error(`xAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content received from xAI')
    }

    // Parse the JSON response from xAI
    let portalNames: string[]
    try {
      // Extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        portalNames = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON array found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse xAI response:', content)
      throw new Error('Invalid response format from xAI')
    }

    // Validate and filter portal names
    if (!Array.isArray(portalNames)) {
      throw new Error('Response is not an array')
    }

    // Filter to only include valid portals and limit to 6
    const validPortals = portalNames
      .filter(name => portalBuilders[name])
      .slice(0, 6)

    // If no valid portals found, use fallback
    if (validPortals.length === 0) {
      console.warn('No valid portals found in xAI response, using fallback')
      return fallbackPortals.map(p => ({ 
        name: p.name, 
        url: p.build(role, location), 
        note: 'Search results page' 
      }))
    }

    // If we got fewer than 4 portals, try to add some relevant ones
    if (validPortals.length < 4) {
      const remainingPortals = Object.keys(portalBuilders).filter(name => !validPortals.includes(name))
      const additionalPortals = remainingPortals.slice(0, 4 - validPortals.length)
      validPortals.push(...additionalPortals)
    }

    // Build portal links
    const result = validPortals.map(name => ({
      name,
      url: portalBuilders[name](role, location),
      note: 'Search results page'
    }))
    return result

  } catch (error) {
    console.error('Error fetching dynamic portals:', error)
    // Return fallback portals on error
    return fallbackPortals.map(p => ({ 
      name: p.name, 
      url: p.build(role, location), 
      note: 'Search results page' 
    }))
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const role = (req.query.role || '').toString().trim()
  const location = (req.query.location || '').toString().trim()
  if (!role || !location) return res.status(400).json({ error: 'role and location required' })

  // Get dynamic portals based on role and location
  const links: PortalLink[] = await getDynamicPortals(role, location)

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
