import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 1. Initialize from localStorage to avoid "flash of light mode"
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [currentUser, setCurrentUser] = useState(null);

  // Helper: API Call
  const saveThemeToBackend = async (userId, theme) => {
    try {
      await fetch(`http://localhost:4000/users/${userId}/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
    } catch (err) {
      console.error('Failed to sync theme with database:', err);
    }
  };

  // 2. Effect: Updates DOM, LocalStorage, and Backend whenever darkMode changes
  useEffect(() => {
    const themeString = darkMode ? 'dark' : 'light';

    // A. Update the Body class (Controls global CSS)
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // B. Save to LocalStorage (Persist on refresh)
    localStorage.setItem('theme', themeString);

    // C. Save to Backend (Only if user is logged in)
    if (currentUser) {
      saveThemeToBackend(currentUser.id, themeString);
    }
  }, [darkMode, currentUser]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  // 3. Sync Function: Called when user successfully logs in
  const syncUserTheme = user => {
    setCurrentUser(user);
    if (user.theme_preference) {
      // If DB has a preference, force the app to match it
      setDarkMode(user.theme_preference === 'dark');
    }
  };

  // 4. Logout Function: Stop syncing
  const clearUserThemeSync = () => {
    setCurrentUser(null);
  };

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleTheme, syncUserTheme, clearUserThemeSync }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook for easy access
export function useTheme() {
  return useContext(ThemeContext);
}
