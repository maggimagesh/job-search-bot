import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

        {/* Results */}
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
                tabIndex={0}
                style={{
                  position: 'relative',
                  background: expanded
                    ? 'linear-gradient(115deg,rgba(255,255,255,0.62),rgba(189,178,255,0.85) 100%)'
                    : 'linear-gradient(120deg,rgba(255,255,255,0.27),rgba(235,211,255,0.78) 90%)',
                  borderRadius: 34,
                  boxShadow: expanded
                    ? '0 12px 50px #b497ffaa, 0 2px 8px #fff8'
                    : '0 6px 34px #b497ff22, 0 1px 7px #fff7',
                  backdropFilter: 'blur(8px) saturate(1.1)',
                  cursor: 'pointer',
                  outline: expanded ? '2px solid #5224a3' : 'none',
                  padding: expanded ? '32px 34px 30px 34px' : '32px 30px 25px 30px',
                  transition: 'all .19s cubic-bezier(.4,1.1,.19,1)',
                  border: expanded
                    ? '2.5px solid #b497ff99'
                    : '1.5px solid rgba(140,90,255,0.13)',
                  animation: 'fadeInUp .8s cubic-bezier(.45,1.1,.2,1)',
                  marginBottom: expanded ? 18 : 0,
                  overflow: 'hidden',
                  minHeight: expanded ? 225 : 130,
                  ...(expanded ? { zIndex: 3 } : {}),
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onClick={() => setExpandedIndex(expanded ? null : idx)}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', marginBottom: 9, gap: 18, flexShrink: 0
                }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#9150fa 15%,#ffe2ed 98%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2em', color: '#fff'
                  }}>
                    {job.company_logo
                      ? <img src={job.company_logo} alt={job.company} style={{ width: 38, height: 38, borderRadius: '50%' }} />
                      : <span>🏢</span>}
                  </div>
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '1.13em',
                      color: '#5224a3',
                      textShadow: '0 2px 8px #d5baff99',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 140,
                    }}>{job.company}</div>
                    <div style={{
                      marginTop: 2,
                      color: '#f684ad',
                      fontWeight: 500,
                      fontSize: 15,
                      textShadow: '0 1px 10px #fff8'
                    }}>
                      📍 {job.location}
                    </div>
                  </div>
                  <div style={{
                    marginLeft: 'auto', alignSelf: 'flex-start', flexShrink: 1, minWidth: 0
                  }}>
                    <span style={{
                      background: 'linear-gradient(110deg, #c8aaff 60%, #f9deff 100%)',
                      color: '#3929d0',
                      padding: '6px 15px',
                      borderRadius: 50, fontWeight: 700, fontSize: 16,
                      letterSpacing: '.01em', boxShadow: '0 1px 8px #b497ff44',
                      whiteSpace: 'nowrap',
                      maxWidth: 180,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                    }}>
                      {job.title}
                    </span>
                  </div>
                </div>

                {/* Summary (always show full details expanded) */}
                <div style={{
                  margin: expanded ? '19px 0 14px 0' : '13px 0 0 0',
                  color: '#6c209d',
                  background: expanded ? 'rgba(255,255,255,0.85)' : undefined,
                  fontSize: 16.5,
                  fontWeight: 500,
                  borderRadius: expanded ? 15 : 0,
                  lineHeight: expanded ? 1.54 : 1.34,
                  padding: expanded ? '16px 24px 14px 16px' : 0,
                  boxShadow: expanded ? '0 1px 10px #fff9' : undefined,
                  textAlign: 'left',
                  textShadow: '0 1px 10px #b497ff22',
                  minHeight: expanded ? 64 : undefined,
                  wordBreak: 'break-word',
                  maxHeight: expanded ? undefined : 34,
                  whiteSpace: expanded ? 'pre-wrap' : 'nowrap',
                  overflow: expanded ? 'auto' : 'hidden',
                  textOverflow: expanded ? undefined : 'ellipsis',
                  fontStyle: expanded ? 'normal' : 'italic',
                  opacity: expanded ? 1 : 0.85,
                  transition: 'all .18s',
                }}>
                  {job.summary}
                </div>

                {/* Apply button - only visible when expanded */}
                {expanded && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginTop: 20,
                    gap: 12,
                  }}>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        color: '#fff',
                        background: 'linear-gradient(95deg, #1a338a 0%, #1f155d 100%)', // darker blue/purple
                        fontWeight: 800,
                        fontSize: '1.1em',
                        borderRadius: '9px',
                        padding: '10px 22px 10px 15px',
                        textDecoration: 'none',
                        boxShadow: '0 2px 14px #1a338a40, 0 1px 5px #0003',
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none',
                        letterSpacing: '.01em',
                        transition: 'background .13s, box-shadow .14s, color .11s',
                        display: 'inline-block',
                      }}
                      onMouseOver={e => { (e.target as HTMLElement).style.background = 'linear-gradient(100deg,#1a338a 0%,#2d218b 110%)'; }}
                      onMouseOut={e => { (e.target as HTMLElement).style.background = 'linear-gradient(95deg, #1a338a 0%, #1f155d 100%)'; }}
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
              😵‍💫 No jobs found for "<span style={{color:'#36e4ff'}}>{role}</span>" at "<span style={{color:'#36e4ff'}}>{location}</span>"
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </>
  );
}
