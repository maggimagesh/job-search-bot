import dynamic from 'next/dynamic';
const ResumeUploadAnalyzer = dynamic(
  () => import('../Components/ResumeUploadAnalyzer'),
  { ssr: false }
);

export default function ResumeAnalysisPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'var(--space-3xl) var(--space-lg)',
        fontFamily: 'Inter, sans-serif',
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
          ⚡ AI-Powered Resume Analysis ⚡
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: '900',
          margin: '0 0 var(--space-md)',
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          background: 'linear-gradient(135deg, #ffffff 0%, var(--accent-primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Resume Analysis
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '700px',
          margin: '0 auto',
          color: 'var(--text-secondary)',
          fontWeight: 400,
          lineHeight: 1.6,
          letterSpacing: '0.3px',
        }}>
          Upload your resume to get AI-powered insights and best matching jobs.
        </p>
      </div>

      <ResumeUploadAnalyzer />
    </div>
  );
}
