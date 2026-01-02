import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'cosmic' | 'aurora' | 'inferno';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('aivision_theme') as Theme) || 'cosmic';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-cosmic', 'theme-aurora', 'theme-inferno');
    root.classList.add(`theme-${theme}`);
    localStorage.setItem('aivision_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};