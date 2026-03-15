import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-card">
        <h1>About Artify</h1>
        <p>
          Artify is an AI-powered image generation platform that lets you bring your imagination to life.
          Powered by the Stable Horde community, we offer free, high-quality image generation.
          This project was built with Django and React as a learning journey, and we hope you enjoy using it!
        </p>
        <p>
          Our mission is to make AI creativity accessible to everyone, with a beautiful and intuitive interface.
          Feel free to explore, generate, and share your creations.
        </p>
        <p><strong>Created by Sultan Iyyaz, a student of software engineering at MUST, Mirpur.</strong></p>
      </div>
    </div>
  );
}

export default About;