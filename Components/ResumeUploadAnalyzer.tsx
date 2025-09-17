'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs';

GlobalWorkerOptions.workerSrc = new URL(pdfWorker, import.meta.url).toString();

export default function ResumeUploadAnalyzer() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

React.useEffect(() => {
  let interval: NodeJS.Timeout | undefined; // Use undefined instead of null
  
  if (loading) {
    setProgress(0);
    let pct = 0;
    interval = setInterval(() => {
      pct = Math.min(pct + Math.random() * 12, 92);
      setProgress(pct);
    }, 350);
  } else {
    setProgress(0);
  }

  // Always return a cleanup function that returns void
  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, [loading]);


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
    setError(null);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
    setError(null);
  };

  const extractTextFromPdf = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    // Fix: pass arrayBuffer directly, not as an object property
    const pdf = await getDocument(arrayBuffer).promise;
    let text = '';
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      text += content.items.map((it: any) => it.str).join(' ') + '\n';
    }
    return text;
  };

  const fileToText = (file: File) =>
    file.type === 'application/pdf'
      ? extractTextFromPdf(file)
      : file.type === 'text/plain'
      ? file.text()
      : Promise.reject(new Error('Only PDF and TXT supported'));

  const handleUpload = async () => {
    if (!file) return setError('👋 Please select or drop a resume first!');
    setLoading(true);
    setError(null);
    try {
      const resumeText = await fileToText(file);
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setTimeout(() => setProgress(100), 600);
      setTimeout(() => {
        router.push(
          `/job-results?role=${encodeURIComponent(
            data.analysis.bestRole
          )}&location=${encodeURIComponent(data.analysis.bestLocation)}`
        );
      }, 1200);
    } catch (err: any) {
      setError('🚫 ' + (err.message ?? 'Error analyzing resume'));
    } finally {
      setLoading(false);
    }
  };

  const avatar = !file ? '🧐' : loading ? '🤖' : error ? '😬' : '🔥';

  return (
    <div
      className="card"
      style={{
        maxWidth: 500,
        margin: '0 auto',
        padding: 'var(--space-3xl)',
        textAlign: 'center'
      }}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div
        className="surface"
        style={{
          border: dragActive ? '2px dashed var(--accent-primary)' : '1px solid var(--bg-elevated)',
          background: dragActive ? 'var(--bg-elevated)' : 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-lg)',
          padding: 'var(--space-2xl) var(--space-lg)',
          transition: 'all var(--transition-normal)',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 'var(--space-md)' }}>{avatar}</div>
        <div style={{
          fontWeight: 700,
          fontSize: '18px',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-sm)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          lineHeight: 1.3,
        }}>
          Drag & drop your resume PDF/TXT here
        </div>
        <div
          style={{
            fontSize: '14px',
            color: 'var(--text-tertiary)',
            marginBottom: 'var(--space-md)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>or</div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn-secondary"
          style={{
            padding: 'var(--space-md) var(--space-xl)',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = 'var(--shadow-lg), var(--shadow-glow)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          {file ? '📄 ' + file.name : 'Choose File'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginTop: 'var(--space-sm)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          PDF or TXT, max 10MB
        </div>
      </div>

      {loading && (
        <div style={{ margin: 'var(--space-lg) auto var(--space-sm)', width: '100%' }}>
          <div style={{
            width: '100%',
            height: 6,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-elevated)',
            overflow: 'hidden',
          }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(90deg, var(--accent-primary) 0%, #00cc77 100%)',
                transition: 'width 0.4s cubic-bezier(.41,.93,.6,1)',
                boxShadow: 'var(--shadow-glow)',
              }}
            />
          </div>
          <div style={{
            marginTop: 'var(--space-sm)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            fontWeight: 600,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Analyzing your resume...
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading || !file}
        className="btn-primary"
        style={{
          width: '100%',
          padding: 'var(--space-md) 0',
          marginTop: 'var(--space-lg)',
          fontSize: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          opacity: loading || !file ? 0.6 : 1,
          cursor: loading || !file ? 'not-allowed' : 'pointer',
        }}
        onMouseOver={e => {
          if (!loading && file) {
            e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg), var(--shadow-glow-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseOut={e => {
          if (!loading && file) {
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--accent-primary) 0%, #3b82f6 100%)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md), var(--shadow-glow)';
            e.currentTarget.style.transform = 'none';
          }
        }}
      >
        {loading ? 'Analyzing...' : '🚀 Analyze Resume'}
      </button>

      {error && (
        <div className="surface" style={{
          color: 'var(--text-error)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--accent-error)',
          borderRadius: 'var(--radius-md)',
          marginTop: 'var(--space-md)',
          padding: 'var(--space-md)',
          fontSize: '14px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {error}
        </div>
      )}

      {!loading && file && !error && (
        <div style={{
          fontSize: '14px',
          color: 'var(--accent-success)',
          marginTop: 'var(--space-md)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {avatar === '🔥' ? 'Resume ready for analysis! Hit the rocket 🚀' : null}
        </div>
      )}

      <div style={{
        marginTop: 'var(--space-lg)',
        fontSize: '12px',
        color: 'var(--text-muted)',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        textAlign: 'center',
      }}>
        🛡️ No files are stored. All analysis happens instantly in private.
      </div>
    </div>
  );
}
