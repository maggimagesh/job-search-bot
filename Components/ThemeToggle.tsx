import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaPalette, FaGoogle } from 'react-icons/fa';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      style={{
        position: 'fixed',
        top: 'var(--space-lg)',
        right: 'var(--space-lg)',
        zIndex: 'var(--z-fixed)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--bg-surface-container-high)',
        borderRadius: 'var(--radius-full)',
        padding: 'var(--space-sm)',
        cursor: 'pointer',
        transition: 'all var(--transition-normal)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-elevated)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-surface)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      title={`Switch to ${theme === 'luxury' ? 'Google' : 'Luxury'} theme`}
    >
      {theme === 'luxury' ? (
        <FaGoogle 
          style={{ 
            fontSize: '20px', 
            color: 'var(--google-blue, #1a73e8)' 
          }} 
        />
      ) : (
        <FaPalette 
          style={{ 
            fontSize: '20px', 
            color: 'var(--accent-primary)' 
          }} 
        />
      )}
    </button>
  );
};

export default ThemeToggle;
