import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { AppRoutes } from './routes';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Layout shell with a simple top nav consistent with theme
  return (
    <div className="App">
      <header className="App-header" style={{ paddingTop: 72 }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <nav style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 12 }}>
          <Link className="App-link" to="/">Home</Link>
        </nav>

        {/* Render route elements here */}
        <AppRoutes />
      </header>
    </div>
  );
}

export default App;
