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
        background: 'linear-gradient(135deg,#5510a6 0%,#823fff 80%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff' }}>
          Resume Analysis
        </h1>
        <p style={{
          fontSize: 18,
          color: 'rgba(255,255,255,0.9)',
          maxWidth: 600,
          margin: '8px auto'
        }}>
          Upload your resume to get AI-powered insights and best matching jobs.
        </p>
      </div>

      <ResumeUploadAnalyzer />
    </div>
  );
}
