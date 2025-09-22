import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';
import JobSearchForm from '../Components/JobSearchForm';
import JobPortalResults from '../Components/JobPortalResults';
import ProTipBar from '../Components/ProTipBar';
import AdzunaLiveJobs from '../Components/AdzunaLiveJobs';
import ThemeToggle from '../Components/ThemeToggle';
import GoogleIcons from '../Components/GoogleIcons';

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function searchJobs(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?role=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}`);
      const data = await res.json();
      setData(data);
    } catch (err) {
      setData({ error: 'Failed to fetch' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`theme-${theme}`}>
      <ThemeToggle />
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 'var(--space-3xl) var(--space-lg)',
          fontFamily: 'var(--font-family)',
          position: 'relative',
        }}
      >
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
          ⚡ AI-Powered Job Search ⚡
        </div>
        <h1 style={{
          fontSize: 'clamp(3rem, 6vw, 4.5rem)',
          fontWeight: theme === 'google' ? 'var(--font-weight-bold)' : '900',
          margin: '0 0 var(--space-md)',
          letterSpacing: theme === 'google' ? '-0.02em' : '-0.03em',
          color: 'var(--text-primary)',
          textShadow: theme === 'google' ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.5)',
          background: theme === 'google' 
            ? 'none' 
            : 'linear-gradient(135deg, #ffffff 0%, var(--accent-primary) 100%)',
          WebkitBackgroundClip: theme === 'google' ? 'initial' : 'text',
          WebkitTextFillColor: theme === 'google' ? 'var(--text-primary)' : 'transparent',
          backgroundClip: theme === 'google' ? 'initial' : 'text',
          fontFamily: 'var(--font-family)',
        }}>
          Dream Job Finder
        </h1>
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          maxWidth: '800px',
          margin: '0 auto',
          color: 'var(--text-secondary)',
          fontWeight: theme === 'google' ? 'var(--font-weight-normal)' : 400,
          lineHeight: 1.6,
          letterSpacing: theme === 'google' ? '0.1px' : '0.3px',
          fontFamily: 'var(--font-family)',
        }}>
          Enter your role and location to unlock opportunities across all major job portals. Your career upgrade starts here.
        </p>
      </div>

      <JobSearchForm
        role={role}
        setRole={setRole}
        location={location}
        setLocation={setLocation}
        searchJobs={searchJobs}
        loading={loading}
        buttonStyle={{
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, #3b82f6 100%)',
          color: 'var(--bg-primary)',
          border: 'none',
          padding: 'var(--space-md) var(--space-xl)',
          borderRadius: 'var(--radius-md)',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md), var(--shadow-glow)',
          transition: 'all var(--transition-normal)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
        buttonHoverStyle={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow-hover)',
          transform: 'translateY(-2px)'
        }}
      />

      <button
        onClick={() => router.push('/resume-analysis')}
        className="btn-secondary"
        style={{
          marginTop: 'var(--space-xl)',
          padding: theme === 'google' ? '12px 24px' : 'var(--space-md) var(--space-xl)',
          fontSize: '16px',
          fontWeight: theme === 'google' ? 'var(--font-weight-medium)' : '600',
          letterSpacing: theme === 'google' ? '0.1px' : '0.5px',
          outline: 'none',
          position: 'relative',
          textTransform: theme === 'google' ? 'none' : 'uppercase',
          borderRadius: theme === 'google' ? '24px' : 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
        }}
        onMouseOver={e => {
          if (theme === 'google') {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          } else {
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg), var(--shadow-glow)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }
        }}
        onMouseOut={e => {
          if (theme === 'google') {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)';
            (e.currentTarget as HTMLElement).style.transform = 'none';
          } else {
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
            (e.currentTarget as HTMLElement).style.transform = 'none';
          }
        }}
      >
        {theme === 'google' ? (
          <GoogleIcons name="rocket" size={20} color="var(--accent-primary)" />
        ) : (
          '🚀'
        )}
        Analyze your resume for better results
      </button>

      <div style={{ maxWidth: '900px', marginTop: 'var(--space-xl)', width: '100%' }}>
        {loading && <p style={{
          color: 'var(--text-accent)', 
          fontWeight: 600, 
          fontSize: 18, 
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0, 212, 255, 0.3)'
        }}>Searching...</p>}
        {data && data.error &&
          <p style={{ 
            color: 'var(--accent-error)', 
            fontWeight: 600, 
            fontSize: 17,
            textAlign: 'center',
            padding: 'var(--space-md)',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--accent-error)',
            boxShadow: 'var(--shadow-md)'
          }}>Error: {data.error}</p>
        }
        {data && !data.error && (
          <>
            <JobPortalResults portals={data.portals} role={role} location={location} />
            <ProTipBar />
            <AdzunaLiveJobs jobs={data.jobs_from_adzuna} />
          </>
        )}
      </div>
      </div>
    </div>
  );
}
