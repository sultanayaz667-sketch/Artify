import React, { useState } from 'react';
import axios from 'axios';
import './Generate.css';

function Generate({ token, onImageGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${API_URL}/generate/`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setImageUrl(response.data.image_url);
      if (onImageGenerated) onImageGenerated();
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-page">
      <div className="generate-card">
        <h2>Generate Image</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter your prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="generate-btn" disabled={loading}>
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {imageUrl && (
          <div className="generated-image-container">
            <h3>Generated Image:</h3>
            <img src={imageUrl} alt={prompt} className="generated-image" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Generate;