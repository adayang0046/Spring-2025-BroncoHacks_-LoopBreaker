import { useState, useEffect, useCallback } from 'react';
import FireMap from './components/FireMap';
import ChatBox from './components/ChatBox';
import ChatInput from './components/ChatInput';
import { askWilliams } from './services/api';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const handleAsk = async (msg) => {
    setLoading(true);
    setQuestion(msg);
    try {
      const data = await askWilliams(
        msg,
        userLocation?.lat || '',
        userLocation?.lon || ''
      );
      setResponse(data.reply || data.error || 'Unexpected response.');
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error talking to Williams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Auto-trigger intro message ONCE on mount
    handleAsk('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Empty dependency array - run only once on mount

  return (
    <div className="App">
      <header className="app-header">
        <img src="/williams.png" alt="Williams" className="header-logo" />
        <div className="header-text">
          <h1>Williams</h1>
          <p>Your Wildfire Safety Assistant</p>
        </div>
      </header>
      {/* Temporarily disabled - 37MB file freezes browser */}
      {/* <FireMap userLocation={userLocation} /> */}
      <div id="chat-container">
        <ChatBox
          question={question}
          response={response}
          loading={loading}
        />
        <ChatInput onAsk={handleAsk} />
      </div>
    </div>
  );
}

export default App;
