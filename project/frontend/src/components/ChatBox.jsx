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
        <div id="response">
          {loading ? 'Williams is thinking...' : response}
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
