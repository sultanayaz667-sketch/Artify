import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Generate from './components/Generate';
import History from './pages/History';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access'));
  const [refreshHistory, setRefreshHistory] = useState(0);

  const onImageGenerated = () => {
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <BrowserRouter>
      <div className="gradient-bg">
        <Header token={token} setToken={setToken} />
        <main className="main-content">
          <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <Routes>
              <Route path="/" element={
                token ? (
                  <Generate token={token} onImageGenerated={onImageGenerated} />
                ) : (
                  <Home />
                )
              } />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/history" element={
                token ? <History token={token} key={refreshHistory} /> : <Login setToken={setToken} />
              } />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;