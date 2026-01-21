import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [currentUser, setCurrentUser] = useState(null);

  const saveThemeToBackend = async (userId, theme) => {
    try {
      await fetch(`http://localhost:4000/users/${userId}/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
    } catch (error) {
      console.error('Failed to sync theme with database:', error);
    }
  };

  useEffect(() => {
    const themeString = darkMode ? 'dark' : 'light';
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', themeString);

    if (currentUser) {
      saveThemeToBackend(currentUser.id, themeString);
    }
  }, [darkMode, currentUser]);

  const toggleTheme = () => setDarkMode(previous => !previous);

  const syncUserTheme = user => {
    setCurrentUser(user);
    if (user.theme_preference) {
      setDarkMode(user.theme_preference === 'dark');
    }
  };

  const clearUserThemeSync = () => setCurrentUser(null);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, syncUserTheme, clearUserThemeSync }}>
      {children}
    </ThemeContext.Provider>
  );
}
