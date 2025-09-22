import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ReactMarkdown from 'react-markdown';

interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
  summary: string;
  source: string;
  company_logo?: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'job_search' | 'clarification';
  jobs?: Job[];
  searchQuery?: { role: string; location: string };
}

export default function JobChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to process text and convert citations to links
  const processTextWithCitations = (text: string) => {
    // Convert [1], [2], etc. to clickable links with better formatting
    return text.replace(/\[(\d+)\]/g, (_, number) => {
      // Create a more meaningful link for citations
      const baseQuery = text.split('[')[0].trim().substring(0, 50); // First 50 chars
      return `[${number}](https://www.perplexity.ai/search?q=${encodeURIComponent(baseQuery)}#${number})`;
    });
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your job search assistant. I can ONLY help with job-related topics:\n• Resume tips and interview prep\n• Career advice and job search strategies\n• Search for jobs (say 'search for [job title] jobs in [location]')\n• Salary negotiation and job market insights\n\nI specialize in career-related questions only. How can I help with your job search?",
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', data);
        throw new Error(data.error || `HTTP ${response.status}: Failed to get response`);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        isUser: false,
        timestamp: new Date(),
        type: data.type || 'text',
        jobs: data.jobs,
        searchQuery: data.searchQuery
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorText = 'Sorry, I encountered an error. Please try again.';
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorText = 'Network error. Please check your internet connection and try again.';
      }
      // Check if it's a server error
      else if (error instanceof Error && error.message.includes('500')) {
        errorText = 'Server error. Please try again in a moment.';
      }
      // Check if it's an API key error
      else if (error instanceof Error && error.message.includes('API')) {
        errorText = 'API configuration error. Please contact support.';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Hi! I'm your job search assistant. I can ONLY help with job-related topics:\n• Resume tips and interview prep\n• Career advice and job search strategies\n• Search for jobs (say 'search for [job title] jobs in [location]')\n• Salary negotiation and job market insights\n\nI specialize in career-related questions only. How can I help with your job search?",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`chat-toggle ${theme}`}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            zIndex: 1000,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            background: theme === 'luxury' 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
            color: 'white',
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
          }}
        >
          {isOpen ? '✕' : '💼'}
        </button>

        {/* Custom Tooltip */}
        {showTooltip && !isOpen && (
          <div
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              background: theme === 'luxury' ? '#2a2a2a' : '#ffffff',
              color: theme === 'luxury' ? '#ffffff' : '#1c1b1f',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: theme === 'luxury' 
                ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                : '0 4px 20px rgba(0, 0, 0, 0.15)',
              zIndex: 1001,
              whiteSpace: 'nowrap',
              border: theme === 'luxury' ? '1px solid #4a4a4a' : '1px solid #e0e0e0',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            How may I help you, today?
            {/* Tooltip Arrow */}
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '20px',
                width: '0',
                height: '0',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${theme === 'luxury' ? '#2a2a2a' : '#ffffff'}`,
              }}
            />
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`chat-window ${theme}`}
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            borderRadius: '16px',
            border: '1px solid var(--bg-elevated)',
            background: 'var(--bg-surface)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--bg-elevated)',
              background: theme === 'luxury' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '20px' }}>💼</div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '13px' }}>Job Assistant</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Always here to help</div>
              </div>
            </div>
            <button
              onClick={clearChat}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '6px',
                padding: '6px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '12px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Clear
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: message.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: message.isUser
                      ? theme === 'luxury'
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)'
                      : theme === 'luxury' ? '#2a2a2a' : 'var(--bg-elevated)',
                    color: message.isUser ? 'white' : (theme === 'luxury' ? '#ffffff' : 'var(--text-primary)'),
                    fontSize: '13px',
                    lineHeight: '1.4',
                    wordWrap: 'break-word',
                    boxShadow: theme === 'luxury' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p style={{ margin: '0 0 8px 0' }}>{children}</p>,
                      strong: ({ children }) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>,
                      em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                      a: ({ href, children }) => (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: message.isUser ? '#ffffff' : (theme === 'luxury' ? '#60a5fa' : '#2563eb'),
                            textDecoration: 'underline',
                            fontWeight: '500'
                          }}
                        >
                          {children}
                        </a>
                      ),
                      ul: ({ children }) => <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ol>,
                      li: ({ children }) => <li style={{ margin: '4px 0' }}>{children}</li>,
                      h1: ({ children }) => <h1 style={{ fontSize: '14px', fontWeight: 'bold', margin: '6px 0 3px 0' }}>{children}</h1>,
                      h2: ({ children }) => <h2 style={{ fontSize: '13px', fontWeight: 'bold', margin: '5px 0 3px 0' }}>{children}</h2>,
                      h3: ({ children }) => <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '4px 0 2px 0' }}>{children}</h3>,
                      code: ({ children }) => (
                        <code style={{ 
                          background: theme === 'luxury' ? '#3a3a3a' : '#f1f5f9',
                          padding: '2px 4px',
                          borderRadius: '3px',
                          fontSize: '12px',
                          fontFamily: 'monospace'
                        }}>
                          {children}
                        </code>
                      )
                    }}
                  >
                    {processTextWithCitations(message.text)}
                  </ReactMarkdown>
                  
                  {/* Job Search Results */}
                  {message.type === 'job_search' && message.jobs && message.jobs.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      {message.jobs.map((job, index) => (
                        <div
                          key={index}
                          style={{
                            background: theme === 'luxury' ? '#3a3a3a' : 'var(--bg-surface)',
                            border: `1px solid ${theme === 'luxury' ? '#4a4a4a' : 'var(--bg-elevated)'}`,
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = theme === 'luxury' ? '#4a4a4a' : 'var(--bg-elevated)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = theme === 'luxury' ? '#3a3a3a' : 'var(--bg-surface)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          onClick={() => window.open(job.url, '_blank')}
                        >
                          <div style={{
                            fontWeight: '600',
                            fontSize: '13px',
                            color: theme === 'luxury' ? '#ffffff' : 'var(--text-primary)',
                            marginBottom: '4px',
                          }}>
                            {job.title}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: theme === 'luxury' ? '#cccccc' : 'var(--text-secondary)',
                            marginBottom: '4px',
                          }}>
                            {job.company} • {job.location}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: theme === 'luxury' ? '#999999' : 'var(--text-tertiary)',
                            marginBottom: '6px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>
                            {job.summary}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: theme === 'luxury' ? '#60a5fa' : 'var(--accent-primary)',
                            fontWeight: '500',
                          }}>
                            {job.source} • Click to view
                          </div>
                        </div>
                      ))}
                      <div style={{
                        fontSize: '12px',
                        color: theme === 'luxury' ? '#666666' : 'var(--text-muted)',
                        textAlign: 'center',
                        marginTop: '8px',
                        fontStyle: 'italic',
                      }}>
                        Click on any job to view details
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    background: theme === 'luxury' ? '#2a2a2a' : 'var(--bg-elevated)',
                    color: theme === 'luxury' ? '#ffffff' : 'var(--text-primary)',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: `2px solid ${theme === 'luxury' ? '#666666' : 'var(--text-muted)'}`,
                      borderTop: `2px solid ${theme === 'luxury' ? '#60a5fa' : 'var(--accent-primary)'}`,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '16px',
              borderTop: `1px solid ${theme === 'luxury' ? '#4a4a4a' : 'var(--bg-elevated)'}`,
              background: theme === 'luxury' ? '#1e1e1e' : 'var(--bg-surface)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about jobs, resumes, interviews..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: `1px solid ${theme === 'luxury' ? '#4a4a4a' : 'var(--bg-elevated)'}`,
                  borderRadius: '20px',
                  background: theme === 'luxury' ? '#2a2a2a' : 'var(--bg-surface)',
                  color: theme === 'luxury' ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '13px',
                  resize: 'none',
                  outline: 'none',
                  minHeight: '20px',
                  maxHeight: '80px',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme === 'luxury' ? '#60a5fa' : 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme === 'luxury' ? '#4a4a4a' : 'var(--bg-elevated)';
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  opacity: inputValue.trim() && !isLoading ? 1 : 0.5,
                  background: theme === 'luxury'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
                  color: 'white',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  if (inputValue.trim() && !isLoading) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ➤
              </button>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: theme === 'luxury' ? '#666666' : 'var(--text-muted)',
                marginTop: '8px',
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              I can only help with job-related topics
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </>
  );
}
