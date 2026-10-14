import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      
      const saved = localStorage.getItem('theme');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      // Default ke sistem user kalau tidak ada preferensi
      if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false;
    } catch (error) {
      console.error('Error loading theme:', error);
      return false;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', JSON.stringify(isDark));
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};