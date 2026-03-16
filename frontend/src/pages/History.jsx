import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';

function History({ token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (err) {
      setError('Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const handleDownload = (imageUrl, prompt) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `artify-${prompt.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await axios.delete(`${API_URL}/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHistory();
    } catch (err) {
      alert('Failed to delete. Please try again.');
    }
  };

  const handleShare = async (imageUrl, prompt) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Artify Image',
          text: `Check out this AI-generated image: ${prompt}`,
          url: imageUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      try {
        await navigator.clipboard.writeText(imageUrl);
        alert('Image link copied to clipboard!');
      } catch (err) {
        alert('Failed to copy link.');
      }
    }
  };

  if (loading) return <div className="loading">Loading history...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="history-page">
      <div className="history-card">
        <h2>Your Past Generations</h2>
        {history.length === 0 ? (
          <p className="no-history">No generations yet. Create one on the home page!</p>
        ) : (
          <div className="history-grid">
            {history.map(item => (
              <div key={item.id} className="history-item">
                <img src={item.image_url} alt={item.prompt} className="history-image" />
                <div className="history-details">
                  <p className="prompt"><strong>Prompt:</strong> {item.prompt}</p>
                  <p className="created"><small>Created: {new Date(item.created_at).toLocaleString()}</small></p>
                  <div className="action-buttons">
                    <button onClick={() => handleDownload(item.image_url, item.prompt)} className="btn-download">⬇️ Download</button>
                    <button onClick={() => handleDelete(item.id)} className="btn-delete">🗑️ Delete</button>
                    <button onClick={() => handleShare(item.image_url, item.prompt)} className="btn-share">🔗 Share</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;