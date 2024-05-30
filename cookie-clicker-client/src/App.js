import React, { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Fetch the initial count from the server
    fetch('http://<SERVER_IP>:<PORT>/count')
      .then(response => response.json())
      .then(data => setCount(data.count));
  }, []);

  const handleClick = () => {
    fetch('http://<SERVER_IP>:<PORT>/click', { method: 'POST' })
      .then(response => response.json())
      .then(data => setCount(data.count));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cookie Clicker</h1>
        <button onClick={handleClick}>Click me!</button>
        <p>Count: {count}</p>
      </header>
    </div>
  );
}

export default App;
