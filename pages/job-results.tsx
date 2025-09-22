import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../Components/ThemeToggle';
import GoogleIcons from '../Components/GoogleIcons';

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
  const { theme } = useTheme();
  const { role, location } = router.query;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (role && location) {
      setLoading(true);
      const apiUrl = `/api/search-jobs?role=${encodeURIComponent(role as string)}&location=${encodeURIComponent(location as string)}`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          setJobs(data.jobs || []);
        })
        .catch((error) => {
          console.error('Error fetching jobs:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [role, location]);
  
  return (
    <div className={`theme-${theme}`}>
      <ThemeToggle />
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: 'var(--bg-primary)',
          padding: 'var(--space-3xl) 0',
          fontFamily: 'var(--font-family)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div
            className="surface"
            style={{
              display: 'inline-block',
              padding: 'var(--space-sm) var(--space-lg)',
              borderRadius: 'var(--radius-full)',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: 'var(--accent-primary)',
              marginBottom: 'var(--space-lg)',
              textTransform: 'uppercase',
              border: '1px solid var(--accent-primary)',
            }}
          >
            ⚡ AI-Powered Job Search Results ⚡
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 1.8rem)',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)',
              letterSpacing: '-0.01em',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-md)',
              flexWrap: 'wrap',
            }}
          >
              {theme === 'google' ? (
              <GoogleIcons name="search" size={24} color="var(--google-blue)" />
            ) : (
              <span role="img" aria-label="search" style={{ fontSize: '1em' }}>🔎</span>
            )}
            <span>
              Dream Jobs for <span style={{ 
                color: 'var(--accent-primary)', 
                fontWeight: '600',
              }}>{role}</span> in{' '}
              <span className="surface" style={{
                padding: 'var(--space-xs) var(--space-sm)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500,
                fontSize: '0.85em',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                border: '1px solid var(--accent-secondary)',
                color: 'var(--accent-secondary)',
                background: 'var(--bg-surface)',
              }}>
                {location}
              </span>
            </span>
          </h1>
          <div
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
              color: 'var(--text-tertiary)',
              fontWeight: 400,
              letterSpacing: '0.2px',
            }}
          >
            AI-matched jobs, picked just for you ✨
          </div>
        </div>

        {/* Job Cards */}
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-lg)',
            padding: '0 var(--space-lg)',
          }}
        >
          {loading && (
            <div className="card" style={{
              textAlign: 'center',
              color: 'var(--text-primary)',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              marginTop: 'var(--space-2xl)',
              padding: 'var(--space-2xl)',
              textTransform: 'uppercase',
            }}>
              ⏳ Fetching your perfect matches...
            </div>
          )}

          {!loading && jobs.length > 0 && jobs.map((job, idx) => {
            const expanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className={expanded ? "card-elevated" : "card"}
                style={{
                  cursor: 'pointer',
                  padding: expanded ? 'var(--space-2xl)' : 'var(--space-xl)',
                  transition: 'all var(--transition-normal)',
                  animation: 'fadeInUp .6s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: expanded ? 'var(--space-lg)' : 'var(--space-sm)',
                }}
                onClick={() => setExpandedIndex(expanded ? null : idx)}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-primary) 0%, #00cc77 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8em', color: 'var(--bg-primary)', flexShrink: 0,
                    boxShadow: 'var(--shadow-glow)',
                  }}>
                    {job.company_logo
                      ? (
                          <Image
                            src={job.company_logo}
                            alt={job.company}
                            width={40}
                            height={40}
                            style={{ borderRadius: '50%' }}
                          />
                        )
                      : <span>🏢</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <span style={{
                      fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      letterSpacing: '0.2px',
                    }}>{job.company}</span>
                    <span style={{ 
                      color: 'var(--text-secondary)', 
                      fontWeight: 400, 
                      fontSize: '13px',
                      letterSpacing: '0.1px',
                    }}>📍 {job.location}</span>
                  </div>
                  <span className="surface" style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 500,
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 180,
                    letterSpacing: '0.2px',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--bg-elevated)',
                    background: 'var(--bg-surface)',
                  }}>
                    {job.title}
                  </span>
                </div>

                {/* Summary */}
                <div style={{
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: 'var(--text-tertiary)',
                  background: expanded ? 'var(--bg-surface)' : 'transparent',
                  padding: expanded ? 'var(--space-sm)' : 0,
                  borderRadius: expanded ? 'var(--radius-sm)' : 0,
                  border: expanded ? '1px solid var(--bg-elevated)' : 'none',
                  whiteSpace: expanded ? 'pre-wrap' : 'nowrap',
                  overflow: expanded ? 'visible' : 'hidden',
                  textOverflow: expanded ? 'clip' : 'ellipsis',
                  fontWeight: 400,
                }}>
                  {job.summary}
                </div>

                {/* Apply button */}
                {expanded && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="btn-primary"
                      style={{
                        padding: 'var(--space-sm) var(--space-lg)',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textDecoration: 'none',
                      }}
                      onMouseOver={e => {
                        (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
                        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg), var(--shadow-glow-hover)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={e => {
                        (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, var(--accent-primary) 0%, #3b82f6 100%)';
                        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md), var(--shadow-glow)';
                        (e.currentTarget as HTMLElement).style.transform = 'none';
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
            <div className="card" style={{
              textAlign: 'center',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '18px',
              padding: 'var(--space-2xl)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
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
    </div>
  );
}
