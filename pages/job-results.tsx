import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
  summary: string;
  company_logo?: string;
}

export default function JobResultsPage() {
  const router = useRouter();
  const { role, location } = router.query;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (role && location) {
      setLoading(true);
      fetch(
        `/api/search-jobs?role=${encodeURIComponent(role as string)}&location=${encodeURIComponent(location as string)}`
      )
        .then((res) => res.json())
        .then((data) => setJobs(data.jobs || []))
        .finally(() => setLoading(false));
    }
  }, [role, location]);

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: 'linear-gradient(140deg, #5a367f 2%, #b497ff 70%, #f6e3ff 100%)',
          padding: '38px 0',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '34px' }}>
          <h1
            style={{
              fontSize: '2.2em',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 6,
              letterSpacing: '.03em',
              textShadow: '0 2px 22px #9150fa33, 0 1px 4px #fff2',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 11,
            }}
          >
            <span role="img" aria-label="search">🔎</span>
            <span>
              Dream Jobs for <span style={{ color: '#36e4ff', textShadow: '0 1px 9px #2c53a3' }}>{role}</span> in{' '}
              <span style={{
                background: '#5224a3',
                color: '#ffe2ed',
                borderRadius: 10,
                padding: '3px 13px',
                marginLeft: 7,
                fontWeight: 600,
                fontSize: '0.94em',
                boxShadow: '0 1px 7px #9150fa24'
              }}>
                {location}
              </span>
            </span>
          </h1>
          <div
            style={{
              fontSize: '18px',
              color: '#e2deff',
              marginTop: 13,
              fontWeight: 500,
              opacity: 0.98,
              letterSpacing: '.03em',
            }}
          >
            <span style={{
              background: 'rgba(54,228,255,0.08)',
              color: '#5224a3',
              borderRadius: 12,
              padding: '5px 15px',
              fontWeight: 600,
              fontSize: '0.96em'
            }}>
              AI-matched jobs, picked just for you 🚀
            </span>
          </div>
        </div>

        {/* Job Cards */}
        <div
          style={{
            maxWidth: 670,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            padding: '0 20px',
          }}
        >
          {loading && (
            <div style={{
              textAlign: 'center',
              color: '#5224a3',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '.04em',
              marginTop: 56,
              textShadow: '0 2px 22px #b497ff33, 0 2px 5px #fff2'
            }}>
              ⏳ Fetching your perfect matches...
            </div>
          )}

          {!loading && jobs.length > 0 && jobs.map((job, idx) => {
            const expanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: expanded
                    ? 'linear-gradient(115deg,rgba(255,255,255,0.62),rgba(189,178,255,0.85) 100%)'
                    : 'linear-gradient(120deg,rgba(255,255,255,0.27),rgba(235,211,255,0.78) 90%)',
                  borderRadius: 34,
                  boxShadow: expanded
                    ? '0 12px 50px #b497ffaa, 0 2px 8px #fff8'
                    : '0 6px 34px #b497ff22, 0 1px 7px #fff7',
                  backdropFilter: 'blur(8px) saturate(1.1)',
                  cursor: 'pointer',
                  border: expanded
                    ? '2.5px solid #b497ff99'
                    : '1.5px solid rgba(140,90,255,0.13)',
                  padding: expanded ? '32px 34px 30px 34px' : '24px 26px',
                  transition: 'all .2s ease',
                  animation: 'fadeInUp .6s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: expanded ? 18 : 8
                }}
                onClick={() => setExpandedIndex(expanded ? null : idx)}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#9150fa 15%,#ffe2ed 98%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2em', color: '#fff', flexShrink: 0
                  }}>
                    {job.company_logo
                      ? (
                          <Image
                            src={job.company_logo}
                            alt={job.company}
                            width={38}
                            height={38}
                            style={{ borderRadius: '50%' }}
                          />
                        )
                      : <span>🏢</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{
                      fontWeight: 700, fontSize: '1.1em', color: '#5224a3',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>{job.company}</span>
                    <span style={{ color: '#f684ad', fontWeight: 500, fontSize: 14 }}>📍 {job.location}</span>
                  </div>
                  <span style={{
                    marginLeft: 'auto',
                    background: '#c8aaff',
                    color: '#3929d0',
                    padding: '6px 12px',
                    borderRadius: 18,
                    fontWeight: 700,
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 180
                  }}>
                    {job.title}
                  </span>
                </div>

                {/* Summary */}
                <div style={{
                  fontSize: 15.5,
                  lineHeight: 1.5,
                  color: '#333',
                  background: expanded ? 'rgba(255,255,255,0.85)' : 'transparent',
                  padding: expanded ? '12px 16px' : 0,
                  borderRadius: expanded ? 12 : 0,
                  boxShadow: expanded ? '0 1px 6px rgba(0,0,0,0.05)' : 'none',
                  whiteSpace: expanded ? 'pre-wrap' : 'nowrap',
                  overflow: expanded ? 'visible' : 'hidden',
                  textOverflow: expanded ? 'clip' : 'ellipsis'
                }}>
                  {job.summary}
                </div>

                {/* Apply button - darker */}
                {expanded && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: 'linear-gradient(95deg, #1a338a 0%, #1f155d 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.95em',
                        borderRadius: 8,
                        textDecoration: 'none',
                        padding: '10px 16px',
                        boxShadow: '0 2px 12px rgba(26,51,138,0.4)',
                        transition: 'all 0.15s'
                      }}
                      onMouseOver={e => {
                        (e.currentTarget as HTMLElement).style.background = 'linear-gradient(95deg, #0f1c4f 0%, #1f155d 100%)';
                      }}
                      onMouseOut={e => {
                        (e.currentTarget as HTMLElement).style.background = 'linear-gradient(95deg, #1a338a 0%, #1f155d 100%)';
                      }}
                    >
                      🔗 Apply / See Details
                    </a>
                  </div>
                )}
              </div>
            );
          })}

          {!loading && jobs.length === 0 && (
            <div style={{
              textAlign: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.23em',
              padding: '46px 0 28px',
              textShadow: '0 2px 20px #b497ff55'
            }}>
              {`😵‍💫 No jobs found for "${role}" at "${location}"`}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </>
  );
}
