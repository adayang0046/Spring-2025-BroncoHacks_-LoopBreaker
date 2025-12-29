import ReactMarkdown from 'react-markdown';

function ChatBox({ question, response, loading }) {
  return (
    <div className="chatbox">
      {question && (
        <div id="questionDisplay">
          You asked: {question}
        </div>
      )}
      <div className="response-container">
        <img src="/williams.png" alt="Williams" className="williams-avatar" />
        <div id="response" className={loading ? 'loading' : ''}>
          {loading ? (
            <span className="loading-dots">Williams is thinking...</span>
          ) : (
            <ReactMarkdown>{response}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
