// src/components/Header.jsx
import { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    // Optional: save preference to localStorage later
    localStorage.setItem('darkMode', !isDarkMode ? 'enabled' : 'disabled');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left: Logo / Title */}
        <div className="logo">
          <a href="/" className="logo-link">
            TechLearn
          </a>
        </div>

        {/* Right: Navigation + Dark mode toggle */}
        <nav className="nav">
            <Link to="/learn">Learn</Link> 
            <Link to="/build">Build</Link> 
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/login">Login</Link>

          {/* Dark/Light toggle button */}
          <button
            onClick={toggleDarkMode}
            className="theme-toggle"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;