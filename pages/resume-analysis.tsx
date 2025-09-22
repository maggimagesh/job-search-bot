import dynamic from 'next/dynamic';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../Components/ThemeToggle';

const ResumeUploadAnalyzer = dynamic(
  () => import('../Components/ResumeUploadAnalyzer'),
  { ssr: false }
);

export default function ResumeAnalysisPage() {
  const { theme } = useTheme();
  
  return (
    <div className={`theme-${theme}`}>
      <ThemeToggle />
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 'var(--space-3xl) var(--space-lg)',
          fontFamily: 'var(--font-family)',
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
          fontWeight: theme === 'google' ? 'var(--font-weight-bold)' : '900',
          margin: '0 0 var(--space-md)',
          letterSpacing: theme === 'google' ? '-0.02em' : '-0.02em',
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
          Resume Analysis
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '700px',
          margin: '0 auto',
          color: 'var(--text-secondary)',
          fontWeight: theme === 'google' ? 'var(--font-weight-normal)' : 400,
          lineHeight: 1.6,
          letterSpacing: theme === 'google' ? '0.1px' : '0.3px',
          fontFamily: 'var(--font-family)',
        }}>
          Upload your resume to get AI-powered insights and best matching jobs.
        </p>
      </div>

      <ResumeUploadAnalyzer />
      </div>
    </div>
  );
}
