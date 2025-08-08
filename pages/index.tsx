import { useState } from 'react';
import JobSearchForm from '../Components/JobSearchForm';
import JobPortalResults from '../Components/JobPortalResults';
import ProTipBar from '../Components/ProTipBar';
import AdzunaLiveJobs from '../Components/AdzunaLiveJobs';

export default function Home() {
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e0035 0%, #3a0ca3 50%, #7209b7 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '14px'
        }}>⚡ AI-Powered Job Search ⚡</div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '20px 0 10px'
        }}>Dream Job Finder</h1>
        <p style={{ fontSize: '18px', maxWidth: '700px', margin: '0 auto', color: '#ddd' }}>
          Enter your role and location to unlock opportunities across all major job portals.
          Your career upgrade starts here! ✨
        </p>
      </div>
      <JobSearchForm
        role={role}
        setRole={setRole}
        location={location}
        setLocation={setLocation}
        searchJobs={searchJobs}
        loading={loading}
      />
      <div style={{ maxWidth: '900px', marginTop: '30px', width: '100%' }}>
        {loading && <p>Searching...</p>}
        {data && data.error && <p style={{ color: 'red' }}>Error: {data.error}</p>}
        {data && (
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
