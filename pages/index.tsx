import { useState } from 'react';
import { useRouter } from 'next/router';
import JobSearchForm from '../Components/JobSearchForm';
import JobPortalResults from '../Components/JobPortalResults';
import ProTipBar from '../Components/ProTipBar';
import AdzunaLiveJobs from '../Components/AdzunaLiveJobs';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function searchJobs(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?role=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}`);
      const j = await res.json();
      setData(j);
    } catch (err) {
      setData({ error: 'Failed to fetch' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e0035 0%, #6e2ad5 60%, #f3c6fe 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.12)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '.04em',
            color: '#dbdbfc',
          }}
        >
          ⚡ AI-Powered Job Search ⚡
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '22px 0 10px',
          letterSpacing: '.03em',
          textShadow: '0 2px 22px #9150fa55',
        }}>
          Dream Job Finder
        </h1>
        <p style={{
          fontSize: '19px',
          maxWidth: '700px',
          margin: '0 auto',
          color: '#e2deff',
          fontWeight: 500,
        }}>
          Enter your role and location to unlock opportunities across all major job portals. Your career upgrade starts here! ✨
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
          background: 'linear-gradient(90deg, #9150fa 0%, #f3c6fe 100%)',
          color: '#fff',
          border: 'none',
          padding: '12px 28px',
          borderRadius: '14px',
          fontSize: '17px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0px 4px 18px rgba(80,40,180,.12)',
          transition: 'box-shadow .18s, transform .14s',
        }}
        buttonHoverStyle={{
          boxShadow: '0px 8px 28px #9150fa33',
          transform: 'scale(1.03)'
        }}
      />

      <button
        onClick={() => router.push('/resume-analysis')}
        style={{
          marginTop: '30px',
          padding: '14px 30px',
          background: 'linear-gradient(90deg, #9150fa 0%, #f3c6fe 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '14px',
          fontSize: '18px',
          fontWeight: 'bold',
          letterSpacing: '.03em',
          cursor: 'pointer',
          boxShadow: '0px 4px 26px rgba(80,40,180,.10)',
          transition: 'box-shadow .18s, transform .14s',
          outline: 'none',
          position: 'relative',
        }}
        onMouseOver={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0px 8px 38px #9150fa33';
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
        }}
        onMouseOut={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0px 4px 26px rgba(80,40,180,.10)';
          (e.currentTarget as HTMLElement).style.transform = 'none';
        }}
      >
        🚀Analyze your resume for better results
      </button>

      <div style={{ maxWidth: '900px', marginTop: '32px', width: '100%' }}>
        {loading && <p style={{
          color: '#9150fa', fontWeight: 600, fontSize: 18, textAlign: 'center'
        }}>Searching...</p>}
        {data && data.error &&
          <p style={{ color: '#ff6f60', fontWeight: 600, fontSize: 17 }}>Error: {data.error}</p>
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
  );
}
