import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="home-card">
        <div className="big-logo">A</div>
        <h1 className="brand-name">
          Artify<sup className="registered">®</sup>
        </h1>
        <p className="tagline">Imagine and create</p>
        <div className="action-buttons">
          <Link to="/register" className="btn btn-register">Register</Link>
          <Link to="/login" className="btn btn-login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;