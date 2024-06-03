import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  const handleSendMessage = async () => {
    try {
      const response = await axios.post('http://10.230.50.14:5000/send', { message });
      alert(response.data.status);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    }
  };

  const handleReceiveMessage = async () => {
    try {
      const response = await axios.get('http://10.230.50.14:5000/receive');
      setReceivedMessage(response.data.message);
    } catch (error) {
      console.error('Error receiving message:', error);
      alert('Error receiving message');
    }
  };

  return (
    <div className="App">
      <h1>Redis Messaging App</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
      <div>
        <button onClick={handleReceiveMessage}>Receive Message</button>
        <p>Received Message: {receivedMessage}</p>
      </div>
    </div>
  );
}

export default App;
