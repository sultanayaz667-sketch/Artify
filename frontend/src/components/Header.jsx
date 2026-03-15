import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ token, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo-placeholder">A</div>
        <span className="site-name">Artify</span>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        {token && <Link to="/history">History</Link>}
      </nav>
      <div className="user-section">
        {token ? (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-btn login">Login</Link>
            <Link to="/register" className="auth-btn register">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;