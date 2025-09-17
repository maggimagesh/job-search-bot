export default function AdzunaLiveJobs({ jobs }: any) {
    if (!jobs?.length) return null;
    return (
      <div className="card" style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-2xl)' }}>
        <h3 style={{ 
          margin: '0 0 var(--space-lg)', 
          color: 'var(--accent-primary)', 
          fontSize: "1.4rem",
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Live jobs from us to you
        </h3>
        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {jobs.map((j: any, i: number) => (
            <li key={i} className="surface" style={{ 
              color: 'var(--text-primary)',
              padding: 'var(--space-lg)',
              marginBottom: 0,
            }}>
              <a href={j.url} target="_blank" rel="noreferrer"
                style={{ 
                  color: 'var(--accent-primary)', 
                  fontWeight: 700, 
                  textDecoration: "none",
                  transition: 'all var(--transition-fast)',
                  fontSize: '16px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                  e.currentTarget.style.color = 'var(--accent-secondary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                }}
              >
                {j.title}
              </a> 
              <div style={{ marginTop: 'var(--space-xs)', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{j.company}</span> • <span style={{ color: 'var(--text-tertiary)' }}>{j.location}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  