import { useState } from 'react';

function ChatInput({ onAsk }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    onAsk(input || '');
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        id="userInput"
        placeholder="Ask about wildfire safety..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button id="askBtn" onClick={handleSubmit}>
        Ask Williams
      </button>
    </div>
  );
}

export default ChatInput;
