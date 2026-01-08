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

  const handleAsk = async (msg, lat, lon) => {
    setLoading(true);
    setQuestion(msg);
    try {
      // Use provided lat/lon if available, otherwise use state
      const latitude = lat !== undefined ? lat : (userLocation?.lat || '');
      const longitude = lon !== undefined ? lon : (userLocation?.lon || '');

      const data = await askWilliams(msg, latitude, longitude);
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
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setUserLocation({ lat, lon });

          // Trigger intro message with location data directly (not from state!)
          handleAsk('', lat, lon);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Still show intro even if location is denied
          handleAsk('', '', '');
        }
      );
    } else {
      // No geolocation support - show intro without location
      handleAsk('', '', '');
    }
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
      <FireMap userLocation={userLocation} />
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
