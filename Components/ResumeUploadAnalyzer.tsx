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
      style={{
        maxWidth: 460,
        margin: '0 auto',
        background: 'linear-gradient(140deg,#2c1b40 2%, #8d60fc 70%,#e6beff 100%)',
        borderRadius: 32,
        boxShadow: '0 7px 32px #7d59ff44, 0 2px 8px #8921c222',
        padding: '42px 24px',
        textAlign: 'center'
      }}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div
        style={{
          border: dragActive ? '2.5px dashed #fff' : '2px solid #e687ff',
          background: dragActive
            ? 'rgba(209,187,255,0.12)'
            : 'linear-gradient(135deg,#5224a3ee 34%,#e9e0ffcc 99%)',
          borderRadius: 24,
          marginBottom: 20,
          boxShadow: '0 4px 28px #7d59ff19',
          padding: '32px 16px 18px',
        }}
      >
        <div style={{ fontSize: 46, marginBottom: 12 }}>{avatar}</div>
        <div style={{
          fontWeight: 800,
          fontSize: 19,
          color: '#fff',
          marginBottom: 8,
          textShadow: '0 2px 18px #3a0ca3aa, 0 1px 6px #fff2',
          letterSpacing: '.04em',
          lineHeight: 1.18,
        }}>
          Drag & drop your resume PDF/TXT here
        </div>
        <div
          style={{
            fontSize: 15,
            color: '#e2deff',
            marginBottom: 13,
            fontWeight: 600,
            textShadow: '0 2px 10px #3929d0aa',
            letterSpacing: '.03em',
            opacity: 0.93,
          }}>or</div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: 'linear-gradient(90deg,#9150fa 0%,#f3c6fe 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '16.5px',
            border: 'none',
            borderRadius: 16,
            boxShadow: '0 2px 12px rgba(112,33,200,.12), 0 1px 7px #fff3',
            cursor: 'pointer',
            transition: '.16s box-shadow, .13s transform',
            textShadow: '0 2px 14px #0007',
            letterSpacing: '.02em',
            outline: 'none'
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = '0 8px 34px #9150fa77';
            e.currentTarget.style.transform = 'scale(1.06)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(112,33,200,.12), 0 1px 7px #fff3';
            e.currentTarget.style.transform = 'scale(1)';
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
          fontSize: 13.5,
          color: '#f8eaff',
          marginTop: 10,
          fontWeight: 500,
          opacity: 0.97,
          textShadow: '0 1px 8px #7d59ff44,0 2px 10px #fff5',
          letterSpacing: '.02em'
        }}>
          PDF or TXT, max 10MB
        </div>
      </div>

      {loading && (
        <div style={{ margin: '18px auto 4px', width: '100%' }}>
          <div style={{
            width: '100%',
            height: 8,
            borderRadius: 6,
            background: 'linear-gradient(90deg,#e687ff 6%, #ffe2ed 100%)',
            overflow: 'hidden',
          }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: 6,
                background: 'linear-gradient(90deg,#9150fa 0%,#f3c6fe 100%)',
                transition: 'width 0.4s cubic-bezier(.41,.93,.6,1)',
              }}
            />
          </div>
          <div style={{
            marginTop: 4,
            fontSize: 15,
            color: '#fff',
            fontWeight: 600,
            textAlign: 'center',
            textShadow: '0 2px 12px #3929d050,0 1px 3px #fff2,0 0px 5px #0008',
            letterSpacing: '.03em',
          }}>
            Analyzing your resume...
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading || !file}
        style={{
          width: '100%',
          padding: '16px 0',
          marginTop: 21,
          background: loading || !file
            ? 'linear-gradient(90deg,#ccc,#ece4fd 94%)'
            : 'linear-gradient(90deg,#9150fa,#f3c6fe 98%)',
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          borderRadius: 16,
          fontSize: '19px',
          boxShadow: '0 2px 14px #6e2ad555',
          cursor: loading || !file ? 'not-allowed' : 'pointer',
          opacity: loading || !file ? 0.61 : 1,
          textShadow: '0 2px 18px #3a0ca388',
          letterSpacing: '.04em',
        }}
      >
        {loading ? 'Analyzing...' : '🚀Analyze Resume'}
      </button>

      {error && (
        <div style={{
          color: '#fff',
          background: 'linear-gradient(94deg,#922,#e74b53 110%)',
          borderRadius: 8,
          marginTop: 13,
          padding: 9,
          fontSize: 16,
          fontWeight: 700,
          textShadow: '0 2px 14px #0007',
          letterSpacing: '.02em'
        }}>
          {error}
        </div>
      )}

      {!loading && file && !error && (
        <div style={{
          fontSize: 17,
          color: '#abe497',
          marginTop: 11,
          fontWeight: 700,
          textShadow: '0 1px 8px #3929d060',
        }}>
          {avatar === '🔥' ? 'Resume ready for analysis! Hit the rocket 🚀' : null}
        </div>
      )}

      <div style={{
        marginTop: 17,
        fontSize: 13.5,
        color: '#f7edff',
        opacity: 0.92,
        fontWeight: 600,
        textShadow: '0 2px 10px #3a0ca3cc,0 1px 5px #fff2',
        letterSpacing: '.03em'
      }}>
        🛡️ No files are stored. All AI happens instantly in private.
      </div>
    </div>
  );
}
