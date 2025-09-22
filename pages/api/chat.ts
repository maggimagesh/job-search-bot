import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check if this is a job search request - more specific patterns
  const jobSearchPatterns = [
    /search for .* jobs? in .*/i,
    /find .* jobs? in .*/i,
    /show me .* jobs? in .*/i,
    /get .* jobs? in .*/i,
    /looking for .* jobs? in .*/i,
    /need .* jobs? in .*/i,
    /want .* jobs? in .*/i,
    /.* jobs? in .*/i,
    /.* positions? in .*/i,
    /.* roles? in .*/i,
    /.* opportunities? in .*/i,
    /search for .* jobs?/i,
    /find .* jobs?/i,
    /show me .* jobs?/i,
    /get .* jobs?/i,
    /looking for .* jobs?/i,
    /need .* jobs?/i,
    /want .* jobs?/i,
    /.* jobs? for .*/i,
    /.* positions? for .*/i,
    /.* roles? for .*/i,
    /.* opportunities? for .*/i
  ];

  // Check for obvious non-job related queries (only very clear non-job topics)
  const obviousNonJobPatterns = [
    /^.*weather.*$/i,
    /^.*temperature.*$/i,
    /^.*news.*$/i,
    /^.*politics.*$/i,
    /^.*sports.*$/i,
    /^.*football.*$/i,
    /^.*movie.*$/i,
    /^.*music.*$/i,
    /^.*food.*$/i,
    /^.*recipe.*$/i,
    /^.*travel.*$/i,
    /^.*vacation.*$/i,
    /^.*health.*$/i,
    /^.*medical.*$/i,
    /^.*doctor.*$/i,
    /^.*who is (?!.*engineer|.*developer|.*manager|.*director|.*ceo|.*cto|.*founder).*$/i,
    /^.*hello.*$/i,
    /^.*hi.*$/i,
    /^.*hey.*$/i,
    /^.*how are you.*$/i,
    /^.*what's up.*$/i,
    /^.*what's new.*$/i
  ];

  const isObviousNonJobQuery = obviousNonJobPatterns.some(pattern => pattern.test(message)) && 
    !jobSearchPatterns.some(pattern => pattern.test(message));

  if (isObviousNonJobQuery) {
    return res.status(200).json({ 
      type: 'text',
      message: "I'm a job search assistant and can only help with career-related questions. How can I assist you with your job search, resume, or interview preparation?" 
    });
  }

  const isJobSearchRequest = jobSearchPatterns.some(pattern => pattern.test(message));

  if (isJobSearchRequest) {
    // Extract job title and location using AI
    try {
      const extractionResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PPLX_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            {
              role: 'system',
              content: `Extract job title and location from the user's message. Return ONLY a JSON object with this exact format:
              {"jobTitle": "extracted job title", "location": "extracted location"}
              
              If you cannot extract both job title and location, return:
              {"jobTitle": null, "location": null}
              
              Examples:
              "I want to find software engineer jobs in New York" -> {"jobTitle": "software engineer", "location": "New York"}
              "Search for marketing jobs in London" -> {"jobTitle": "marketing", "location": "London"}
              "Search for prompt engineering in bangalore" -> {"jobTitle": "prompt engineering", "location": "bangalore"}
              "Find data scientist positions in Mumbai" -> {"jobTitle": "data scientist", "location": "Mumbai"}
              "Show me jobs in San Francisco" -> {"jobTitle": null, "location": "San Francisco"}
              "I need developer jobs" -> {"jobTitle": "developer", "location": null}
              
              IMPORTANT: Extract the exact job title as mentioned, even if it's a specific field like "prompt engineering", "machine learning engineer", etc.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 100,
          temperature: 0.1,
        }),
      });

      if (extractionResponse.ok) {
        const extractionData = await extractionResponse.json();
        const extractedInfo = JSON.parse(extractionData.choices[0]?.message?.content || '{}');
        
        if (extractedInfo.jobTitle && extractedInfo.location) {
          // Both job title and location found, search for jobs
          const jobSearchResponse = await fetch(`${req.headers.origin || 'http://localhost:3000'}/api/chat-search-jobs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              role: extractedInfo.jobTitle,
              location: extractedInfo.location
            }),
          });

          if (jobSearchResponse.ok) {
            const jobData = await jobSearchResponse.json();
            return res.status(200).json({ 
              type: 'job_search',
              message: `I found ${jobData.total} jobs for "${extractedInfo.jobTitle}" in "${extractedInfo.location}":`,
              jobs: jobData.jobs,
              searchQuery: { role: extractedInfo.jobTitle, location: extractedInfo.location }
            });
          }
        } else if (extractedInfo.jobTitle || extractedInfo.location) {
          // Only one found, ask for the missing one
          const missingField = extractedInfo.jobTitle ? 'location' : 'job title';
          return res.status(200).json({ 
            type: 'clarification',
            message: `I can help you search for jobs! I found the ${extractedInfo.jobTitle ? 'job title' : 'location'}, but I need the ${missingField}. Please tell me what ${missingField} you're looking for.`
          });
        }
      }
    } catch (error) {
      console.error('Job search extraction failed:', error);
      // If job search fails, continue to regular AI response
    }
  }

  // Job-focused system prompt to restrict conversations
  const systemPrompt = `You are a helpful job search assistant. You can ONLY help with job-related topics including:
- Job search strategies and tips
- Resume writing and optimization
- Interview preparation and techniques
- Career advice and development
- Salary negotiation
- Job market insights
- Industry trends and requirements
- Networking for job search
- Skills assessment and development
- Job application processes

IMPORTANT: You MUST ONLY respond to job-related queries. If the user asks about anything NOT related to jobs, careers, or employment (like general questions, weather, news, entertainment, etc.), politely but firmly redirect them back to job-related topics.

Example responses for non-job queries:
- "I'm a job search assistant and can only help with career-related questions. How can I assist you with your job search, resume, or interview preparation?"
- "I specialize in job search and career advice. Please ask me about jobs, resumes, interviews, or career development instead."

Always be helpful, professional, and encouraging when discussing job-related matters.`;

  try {
    // Check if API key is available
    if (!process.env.PPLX_API_KEY) {
      throw new Error('PPLX_API_KEY is not set in environment variables');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PPLX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Perplexity API error response:', errorData);
      throw new Error(`Perplexity API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    const botMessage = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    res.status(200).json({ message: botMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: `Failed to get response from chat assistant: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
}
