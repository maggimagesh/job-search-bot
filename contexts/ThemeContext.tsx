import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'luxury' | 'google';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('luxury');

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check for saved theme preference or default to luxury
      const savedTheme = localStorage.getItem('job-bot-theme') as Theme;
      if (savedTheme && (savedTheme === 'luxury' || savedTheme === 'google')) {
        setTheme(savedTheme);
      } else {
        // A/B testing: Randomly assign theme on first visit
        const randomTheme = Math.random() < 0.5 ? 'luxury' : 'google';
        setTheme(randomTheme);
        localStorage.setItem('job-bot-theme', randomTheme);
      }
    }
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('job-bot-theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'luxury' ? 'google' : 'luxury';
    handleSetTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
