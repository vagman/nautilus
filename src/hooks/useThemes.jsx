// src/hooks/useTheme.js
import { useState, useEffect } from 'react';

export function useTheme() {
  // 1. Lazy initialization: Check localStorage first, default to false (light)
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // 2. Update localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // 3. Simple toggle function
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return { darkMode, toggleTheme };
}
