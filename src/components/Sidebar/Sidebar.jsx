import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext'; // Note the extra '../' since we moved deeper
import styles from './Sidebar.module.css'; // <--- Import as a Module

function Sidebar({ isOpen, toggleSidebar, user }) {
  const { darkMode, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.sidebarOverlay} ${isOpen ? styles.open : ''}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Panel */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3>Menu</h3>
          <button className={styles.closeBtn} onClick={toggleSidebar}>
            &times;
          </button>
        </div>

        <div className={styles.userInfo}>
          <p>
            👤 <strong>{user.username}</strong>
          </p>
        </div>

        <ul className={styles.sidebarMenu}>
          {/* Settings Dropdown */}
          <li
            className={`${styles.menuItem} ${
              showSettings ? styles.active : ''
            }`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <div className={styles.menuLabel}>
              <span>⚙️ Settings</span>
              <span className={styles.arrow}>{showSettings ? '▼' : '▶'}</span>
            </div>
          </li>

          {/* Submenu */}
          {showSettings && (
            <ul className={styles.submenu}>
              <li
                onClick={e => {
                  e.stopPropagation();
                  toggleTheme();
                }}
              >
                {darkMode ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
              </li>
            </ul>
          )}

          <li className={styles.menuItem}>🤝 Volunteer</li>
          <li className={styles.menuItem}>❓ Help</li>
          <li className={styles.menuItem}>ℹ️ About</li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
